import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    AsyncStorage,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import uuidv1 from 'uuid/v1'
import Drawer from 'react-native-drawer'
import { StackActions, NavigationActions } from 'react-navigation';

import Device from './Device'
import DrawerButton from './graph/components/DrawerButton'
import Footer from './Footer'


const { width, height } = Dimensions.get('window');
const MENU_IMAGE = require('../assets/menu.png');
const BACK_IMAGE = require('../assets/back.png');
const LOGO_IMAGE = require('../assets/logo.png');

const menu = [
    { title: 'Main' },
    { title: 'Profile' },
    { title: 'Setting' },
    { title: 'Log out' },
    { title: 'Help' },
    { title: 'Copyright' },
]

const ADD_DEVICE_IMAGE = require('../assets/addDevice.png');

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            devices: undefined,
            refreshing: false
        };

        this.navigateToGraphScreen = this.navigateToGraphScreen.bind(this);
        this.navigateToBLESettings = this.navigateToBLESettings.bind(this);
        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.logOut_async = this.logOut_async.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.goBack = this.goBack.bind(this);
        this.moveToDeviceListSettingScreen = this.moveToDeviceListSettingScreen.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        let email = this.props.navigation.getParam('email', '');
        if (email) {
            this.fetchData(email);
        } else {
            this.getEmailFromAsyncStorage_async();
        }
    }

    getEmailFromAsyncStorage_async = async () => {
        let email = await AsyncStorage.getItem('9room@email');
        this.fetchData(email);
    }

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
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
                    onPress = this.closeDrawer;
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
            <SafeAreaView style={styles.drawerContainer}>
                <View style={styles.drawerContainer}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
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

    fetchData = (email) => {
        const url = 'http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/main/mainUuid?email=' + email;
        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let devicesList = result.concat(['add'])
                    this.setState({
                        isLoaded: true,
                        devices: devicesList,
                        refreshing: false
                    });
                }
            )
            .catch((error) => {
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                console.log(error);
                this.setState({
                    isLoaded: false,
                    refreshing: false
                });
            });
    }

    navigateToBLESettings = () => {
        this.closeDrawer();
        console.log('navigate to ble setting screen');
        this.props.navigation.navigate('BLEManaer');
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

    navigateToGraphScreen = (deviceNum) => {
        this.props.navigation.navigate('Graph', { deviceNum: deviceNum });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    moveToDeviceListSettingScreen = () => {
        this.props.navigation.navigate('DeviceListSetting');
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getEmailFromAsyncStorage_async();
    }

    render() {
        let { isLoaded, devices, refreshing } = this.state;

        if (isLoaded) {
            let Devices = devices.map(d => {
                if (d == 'add') {
                    return (
                        <View key={uuidv1()} style={styles.addDeviceContainer}>
                            <TouchableOpacity style={styles.addDeviceButton} onPress={this.moveToDeviceListSettingScreen}>
                                <Image style={styles.addDeviceImage} source={ADD_DEVICE_IMAGE} />
                            </TouchableOpacity>
                        </View>
                    );
                }

                let deviceNum = d['deviceNum'];
                let geiger = d['geiger'];
                let temperature = d['temperature'];
                let humidity = d['humidity'];

                let geigerIsNull = false;
                let temperatureIsNull = false;
                let humidityIsNull = false;

                if (geiger == null) geigerIsNull = true;
                if (temperature == null) temperatureIsNull = true;
                if (humidity == null) humidityIsNull = true;

                return (
                    <Device
                        key={uuidv1()}
                        onPressed={this.navigateToGraphScreen}
                        deviceNum={deviceNum}
                        currentGeiger={geigerIsNull ? 0.1 : geiger}
                        currentTemp={temperatureIsNull ? 25 : temperature}
                        currentHumi={humidityIsNull? 58 : humidity}
                        geigerIsNull={geigerIsNull}
                        temperatureIsNull={temperatureIsNull}
                        humidityIsNull={humidityIsNull}
                    />
                )
            });

            return (
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="light-content" />
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
                            <Image style={{ width: width / 3, height: height / 12 - 15 }} source={LOGO_IMAGE} />
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView
                            style={styles.devicesContainer}
                            scrollEnabled={true}
                            indicatorStyle={'white'}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        >
                            {Devices}
                        </ScrollView>
                        <Footer/>
                    </Drawer>
                </SafeAreaView>
            )
        } else {
            return (
                <View style={styles.loadingScreenContainer}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            )
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
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'center'
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    devicesContainer: {
        flex: 1,
        backgroundColor: "white"
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
        color: 'white',
        fontSize: width / 25
    },
    menuButton: {
        marginLeft: width / 40,
        marginRight: width / 40,
        alignSelf: 'center',
        tintColor: 'lightgrey'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    drawerContainer: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    loadingScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1a3f95'
    },
    addDeviceImage: {
        width: 30,
        height: 30,
        tintColor: '#3B5998'
    },
    addDeviceButton: {
        width: width,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    addDeviceContainer: {
        width: width,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    }
});
