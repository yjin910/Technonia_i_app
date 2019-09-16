import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Text,
    AsyncStorage,
    ActivityIndicator
} from 'react-native'
import Drawer from 'react-native-drawer'
import { createMaterialTopTabNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import uuidv1 from 'uuid/v1';

import TemperatureGraph from './TemperatureGraph'
import HumidityGraph from './HumidityGraph'
import GeigerGraph from './GeigerGraph'
import DrawerButton from './components/DrawerButton'
import Footer from '../Footer';


const INTERVAL_TIME = 300000;
const MENU_IMAGE = require('../../assets/menu.png');
const BACK_IMAGE = require('../../assets/back.png');
const LOGO_IMAGE = require('../../assets/logo.png');
const { width, height } = Dimensions.get('window');

const menu = [
    { title: 'Main' },
    { title: 'Profile' },
    { title: 'Setting' },
    { title: 'Log out' },
    { title: 'Help' },
    { title: 'Copyright' },
]

export default class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            errorOccured: false,
            data_t: [],
            data_h: [],
            data_g: [],
            ts: [],
            hs: [],
            gs: [],
            min_t: 0,
            min_h: 0,
            min_g: 0,
            max_t: 0,
            max_h: 0,
            max_g: 0,
            isLoaded: false,
            customPicker: false,
            datePickerData: [
                {
                    label: '1일',
                    value: 1,
                    size: 15,
                    color: 'dodgerblue'
                },
                {
                    label: '1주일',
                    value: 2,
                    size: 15,
                    color: 'dodgerblue'
                },
                {
                    label: '1달',
                    value: 3,
                    size: 15,
                    color: 'dodgerblue'
                },
                {
                    label: '지정',
                    value: 4,
                    size: 15,
                    color: 'dodgerblue'
                },
            ]
        }

        this.openDrawer = this.openDrawer.bind(this);

        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.navigateToBLESettings = this.navigateToBLESettings.bind(this);
        this.goBack = this.goBack.bind(this);

        this.logOut_async = this.logOut_async.bind(this);

        this.refresh = this.refresh.bind(this);
        this.changeDatePickerData = this.changeDatePickerData.bind(this);
        this.fetchDataWithCustomTerm_async = this.fetchDataWithCustomTerm_async.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        let deviceNum = this.props.navigation.getParam('deviceNum', '');
        this.fetchData_Async(deviceNum);

        //TODO this.setInterval();
    }

    changeDatePickerData = async (data) => {
        let selectedVal = data.find(e => e.selected == true).value;

        if (selectedVal == 4) {
            this.setState({ datePickerData: data, customPicker: true });
        } else {
            this.setState({ datePickerData: data, customPicker: false });
            let deviceNum = this.props.navigation.getParam('deviceNum', '');
            this.fetchData_Async(deviceNum, selectedVal);
        }
    }

    setInterval = () => {
        let deviceNum = this.props.navigation.getParam('deviceNum', '');

        this._timer = setInterval(() => {
            console.log('fetch data start');
            this.fetchData_Async(deviceNum);
        }, INTERVAL_TIME);
    }

    removeInterval = () => {
        clearInterval(this._timer);
    }

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    renderDrawer = () => {
        const MENU_VIEW = menu.map((item, index) => {
            let title = item.title;
            let onPress;

            switch (title) {
                case 'Setting':
                    onPress = this.navigateToBLESettings;
                    break;
                case 'Log out':
                    onPress = this.logOut_async;
                    break;
                case 'Main':
                    onPress = this.navigateToMainScreen;
                    break;
                case 'Profile':
                    onPress = this.navigateToProfileScreen;
                    break;
                case 'Help':
                    onPress = this.navigateToHelpScreen;
                    break;
                case 'Copyright':
                    onPress = this.navigateToCopyrightScreen;
                    break;
                default:
                    console.log('Invalid title: ', title);
                    onPress = null;
            }

            return (<DrawerButton onPress={onPress} title={title} key={uuidv1()} />);
        });

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
    }

    componentWillUnmount = () => {
        this.removeInterval();
    }

    logOut_async = async () => {
        await AsyncStorage.removeItem('9room@email');
        await AsyncStorage.removeItem('9room@pw');
        await AsyncStorage.removeItem('9room@autoLogin');

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });

        this.props.navigation.dispatch(resetAction);
    }

    navigateToMainScreen = async () => {
        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Main', { email: email });
    }

    navigateToHelpScreen = () => {
        this.closeDrawer();
        this.props.navigation.navigate('Help');
    }

    navigateToCopyrightScreen = () => {
        this.closeDrawer();
        this.props.navigation.navigate('Copyright');
    }

    navigateToProfileScreen = async () => {
        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Profile', { email: email });
    }

    navigateToBLESettings = () => {
        this.closeDrawer();
        console.log('navigate to ble setting screen');
        this.props.navigation.navigate('BLEManaer');
    }

    refresh = async () => {
        let {url} = this.state;
        if (url != '') this.processDataFetching_async(url);
    }

    fetchDataWithCustomTerm_async = async (term) => {
        let deviceNum = this.props.navigation.getParam('deviceNum', '');
        this.fetchData_Async(deviceNum, 4, term);
    }

    fetchData_Async = async (deviceNum, val, term) => {
        let url = `http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/getdata?u=${deviceNum}`;

        if (val) {
            switch (val) {
                case 1:
                    url += `&term=14` //1 day = 24 hours
                    break;
                case 2:
                    url += `&term=168` //1 week = 168 hours
                    break;
                case 3:
                    url += `&term=720` //30 days = 720 hours
                    break;
                case 4:
                    if (term) url += `&term=${term}`
                    break;
                default:
                    console.log('Invalid value!');
            }
        }

        this.processDataFetching_async(url);
    }

    processDataFetching_async = async (url) => {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let num = result.length;
                    let data_t = [];
                    let data_h = [];
                    let data_g = [];

                    let ts = [];
                    let hs = [];
                    let gs = [];

                    let min_t, min_h, min_g, max_t, max_h, max_g;

                    let isNotFirst_t = false;
                    let isNotFirst_h = false;
                    let isNotFirst_g = false;

                    for (let i = 0; i < num; i++) {
                        let d = result[i];
                        let type = d['type'];
                        let time_val = new Date(d['time']);

                        switch (type) {
                            case 't':
                                let t = d['val'];
                                if (isNotFirst_t) {
                                    min_t = (min_t < t) ? min_t : t;
                                    max_t = (max_t > t) ? max_t : t;
                                } else {
                                    min_t = t;
                                    max_t = t;
                                    isNotFirst_t = true;
                                }

                                data_t.push({ x: time_val, y: t });
                                ts.push(t);

                                break;
                            case 'h':
                                let h = d['val'];

                                if (isNotFirst_h) {
                                    min_h = (min_h < h) ? min_h : h;
                                    max_h = (max_h > h) ? max_h : h;
                                } else {
                                    min_h = h;
                                    max_h = h;
                                    isNotFirst_h = true;
                                }

                                data_h.push({ x: time_val, y: h });
                                hs.push(h);

                                break;
                            case 'g':
                                let g = d['val'];

                                if (isNotFirst_g) {
                                    min_g = (min_g < g) ? min_g : g;
                                    max_g = (max_g > g) ? max_g : g;
                                } else {
                                    min_g = g;
                                    max_g = g;
                                    isNotFirst_g = true;
                                }

                                data_g.push({ x: time_val, y: g });
                                gs.push(g);

                                break;
                        }
                    }

                    this.setState({
                        url: url,
                        data_t: data_t,
                        data_h: data_h,
                        data_g: data_g,
                        ts: ts,
                        hs: hs,
                        gs: gs,
                        min_t: min_t,
                        min_h: min_h,
                        min_g: min_g,
                        max_t: max_t,
                        max_h: max_h,
                        max_g: max_g,
                        isLoaded: true
                    });
                }
            )
            .catch((error) => {
                console.log(error);

                this.setState({ isLoaded: true, errorOccured: true });
            });
    }

    render() {
        let { errorOccured, data_t, data_h, data_g, ts, hs, gs, min_t, min_h, min_g, max_t, max_h, max_g, isLoaded, datePickerData, customPicker } = this.state;

        if (isLoaded) {

            if (errorOccured) {
                return (
                    <SafeAreaView style={styles.root}>
                        <Drawer
                            ref={(ref) => this.drawer = ref}
                            content={this.renderDrawer()}
                            type='overlay'
                            tapToClose={true}
                            openDrawerOffset={0.6}
                            styles={drawerStyles}
                            side={'right'}
                        >
                            <View style={styles.headerContainer}>
                                <View style={styles.menuButton}>
                                    <TouchableOpacity
                                        onPress={() => this.goBack()}
                                        style={{ tintColor: 'white', width: width / 9, height: width / 9, marginRight: width / 30, justifyContent: 'center' }}>
                                        <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={BACK_IMAGE} />
                                    </TouchableOpacity>
                                </View>
                                <Image style={{ width: width / 3, height: height / 12 - 15, marginTop: 10 }} source={LOGO_IMAGE} />
                                <View style={styles.menuButton}>
                                    <TouchableOpacity
                                        onPress={() => this.openDrawer()}
                                        style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center' }}>
                                        <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.requestFailedContainer}>
                                <Text style={styles.requestFailedText}>
                                    Request failed
                                </Text>
                            </View>
                            <Footer />
                        </Drawer>
                    </SafeAreaView>
                );
            }

            const Temperature = (props) => (<TemperatureGraph
                temperatureData={props.screenProps.temperatureData}
                t={props.screenProps.ts}
                min={props.screenProps.min_t}
                max={props.screenProps.max_t}
                refresh={props.screenProps.refresh}
                pickerData={props.screenProps.pickerData}
                changePickerData={props.screenProps.changePickerData}
                customPicker={props.screenProps.customPicker}
                fetchData={props.screenProps.fetchData}
            />);
            const Humidity = (props) => (<HumidityGraph
                humidityData={props.screenProps.humidityData}
                h={props.screenProps.hs}
                min={props.screenProps.min_h}
                max={props.screenProps.max_h}
                refresh={props.screenProps.refresh}
                pickerData={props.screenProps.pickerData}
                changePickerData={props.screenProps.changePickerData}
                customPicker={props.screenProps.customPicker}
                fetchData={props.screenProps.fetchData}
            />);
            const Geiger = (props) => (<GeigerGraph
                geigerData={props.screenProps.geigerData}
                g={props.screenProps.gs}
                min={props.screenProps.min_g}
                max={props.screenProps.max_g}
                refresh={props.screenProps.refresh}
                pickerData={props.screenProps.pickerData}
                changePickerData={props.screenProps.changePickerData}
                customPicker={props.screenProps.customPicker}
                fetchData={props.screenProps.fetchData}
            />);

            const AppNavigator = createMaterialTopTabNavigator({
                G: {
                    screen: Geiger,
                    navigationOptions: {
                        tabBarLabel: <Text style={{ fontSize: width / 30, color: 'white' }}> Geiger </Text>,
                    }
                },
                T: {
                    screen: Temperature,
                    navigationOptions: {
                        tabBarLabel: <Text style={{ fontSize: width / 30, color: 'white' }}> Temperature </Text>,
                    }
                },
                H: {
                    screen: Humidity,
                    navigationOptions: {
                        tabBarLabel: <Text style={{ fontSize: width / 30, color: 'white' }}> Humidity </Text>,
                    }
                }
            });

            const GraphApp = createAppContainer(AppNavigator);

            return (
                <SafeAreaView style={styles.root}>
                    <Drawer
                        ref={(ref) => this.drawer = ref}
                        content={this.renderDrawer()}
                        type='overlay'
                        tapToClose={true}
                        openDrawerOffset={0.6}
                        styles={drawerStyles}
                        side={'right'}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.goBack()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, marginRight: width / 30, justifyContent: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={BACK_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Image style={{ width: width / 3, height: height / 12 - 15, marginTop: 10 }} source={LOGO_IMAGE} />
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <GraphApp screenProps={{
                            temperatureData: data_t,
                            humidityData: data_h,
                            geigerData: data_g,
                            ts: ts,
                            hs: hs,
                            gs: gs,
                            min_t: min_t,
                            min_h: min_h,
                            min_g: min_g,
                            max_t: max_t,
                            max_h: max_h,
                            max_g: max_g,
                            refresh: this.refresh,
                            pickerData: datePickerData,
                            changePickerData: this.changeDatePickerData,
                            customPicker: customPicker,
                            fetchData: this.fetchDataWithCustomTerm_async
                        }} />
                        <Footer/>
                    </Drawer>
                </SafeAreaView>
            )
        } else {
            return (
                <View style={styles.loadingScreenContainer}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            );
        }
    }
}


const drawerStyles = {
    drawer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    main: {
        flex: 1.0,
        backgroundColor: 'white'
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    mainContainer: {
        flex: 1.0,
        backgroundColor: 'white'
    },
    safeAreaStyle: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    headerContainer: {
        height: height / 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3B5998',
    },
    headerTitle: {
        flex: 1.0,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white'
    },
    menuButton: {
        marginLeft: 8,
        marginRight: 8,
        alignSelf: 'center',
        tintColor: 'white'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    container: {
        flex: 1,
    },
    loadingScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1a3f95'
    },
    requestFailedText: {
        color: 'red',
        fontSize: width / 25
    },
    requestFailedContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1
    }
});
