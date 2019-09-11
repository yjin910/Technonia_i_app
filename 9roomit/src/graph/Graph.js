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

const INTERVAL_TIME = 300000;
const MENU_IMAGE = require('../../assets/menu.png');
const BACK_IMAGE = require('../../assets/back.png');
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
            isLoaded: false
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
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        let deviceNum = this.props.navigation.getParam('deviceNum', '');
        this.fetchData_Async(deviceNum);

        this.setInterval();
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
        let email = await AsyncStorage.getItem('9room@email');
        this.fetchData_Async(email);
    }

    fetchData_Async = async (deviceNum) => {
        const url = `http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/getdata?u=${deviceNum}`;
        console.log(url);

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
                                let t = parseFloat(d['val']);
                                if (isNotFirst_t) {
                                    min_t = (min_t < t) ? min_t : t;
                                } else min_t = t;
                                if (max_t) {
                                    max_t = (max_t > t) ? max_t : t;
                                } else {
                                    max_t = t;
                                    isNotFirst_t = true;
                                }

                                data_t.push({ x: time_val, y: t });
                                ts.push(t);

                                break;
                            case 'h':
                                let h = parseFloat(d['val']);

                                if (isNotFirst_h) {
                                    min_h = (min_h < h) ? min_h : h;
                                } else min_h = h;
                                if (isNotFirst_h) {
                                    max_h = (max_h > h) ? max_h : h;
                                } else {
                                    max_h = h;
                                    isNotFirst_h = true;
                                }

                                data_h.push({ x: time_val, y: h });
                                hs.push(h);

                                break;
                            case 'g':
                                let g = parseFloat(d['val']);

                                if (isNotFirst_g) {
                                    min_g = (min_g < g) ? min_g : g;
                                } else min_g = g;
                                if (isNotFirst_g) {
                                    max_g = (max_g > g) ? max_g : g;
                                } else {
                                    max_g = g;
                                    isNotFirst_g = true;
                                }

                                data_g.push({ x: time_val, y: g });
                                gs.push(g);

                                break;
                        }
                    }

                    this.setState({
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
            });
    }

    render() {
        let { data_t, data_h, data_g, ts, hs, gs, min_t, min_h, min_g, max_t, max_h, max_g, isLoaded } = this.state;

        if (isLoaded) {
            //TODO
            // max_g = ((max_g - min_g) <= 0.5) ? 0.55 : max_g;
            // min_g = (min_g == 0) ? -0.05 : min_g;

            const Temperature = (props) => (<TemperatureGraph
                temperatureData={props.screenProps.temperatureData}
                t={props.screenProps.ts}
                min={props.screenProps.min_t}
                max={props.screenProps.max_t}
                refresh={props.screenProps.refresh}
            />);
            const Humidity = (props) => (<HumidityGraph
                humidityData={props.screenProps.humidityData}
                h={props.screenProps.hs}
                min={props.screenProps.min_h}
                max={props.screenProps.max_h}
                refresh={props.screenProps.refresh}
            />);
            const Geiger = (props) => (<GeigerGraph
                geigerData={props.screenProps.geigerData}
                g={props.screenProps.gs}
                min={props.screenProps.min_g}
                max={props.screenProps.max_g}
                refresh={props.screenProps.refresh}
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
                        openDrawerOffset={0.7}
                        styles={drawerStyles}
                        side={'right'}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.goBack()}
                                    style={{ tintColor: 'white', width: width / 10, height: width / 10, marginRight: width / 30 }}>
                                    <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={BACK_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.headerTitle}>Graph</Text>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 10, height: width / 10 }}>
                                    <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={MENU_IMAGE} />
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
                            refresh: this.refresh
                        }} />
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
        height: height / 10,
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
    }
});