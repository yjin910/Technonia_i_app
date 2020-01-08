import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ScrollView,
    AppState,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Drawer from 'react-native-drawer'
import uuidv1 from 'uuid/v1';
import { StackActions, NavigationActions } from 'react-navigation';

import DrawerButton from '../graph/components/DrawerButton'
import Footer from '../Footer';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const TARGET_BLE_DEVICE_NAME = '9room';
//const BLUETOOTH_ICON = require('../../assets/icon_bluetooth.png');

const { width, height } = Dimensions.get('window');

const BACK_IMAGE = require('../../assets/back.png');
const MENU_IMAGE = require('../../assets/menu.png');
const LOGO_IMAGE = require('../../assets/logo.png');

const menu = [
    { title: 'Main' },
    { title: 'Profile' },
    { title: 'Setting' },
    { title: 'Log out' },
    { title: 'Help' },
    { title: 'Copyright' },
]


export default class BluetoothManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: '',
            isLoaded: false,
            refreshing: false,
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);

        this.startScan = this.startScan.bind(this);
        this.scanBLE = this.scanBLE.bind(this);

        this.connectToPeripheral = this.connectToPeripheral.bind(this);
        this.goBack = this.goBack.bind(this);

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);

        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.logOut_async = this.logOut_async.bind(this);

        this.onRefresh = this.onRefresh.bind(this);
    }


    static navigationOptions = {
        header: null
    };

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
                    onPress = this.closeDrawer;
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

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({ showAlert: false });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    this.scanBLE();
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                            this.scanBLE();
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        } else {
            this.scanBLE();
        }
    }

    handleAppStateChange = (nextAppState) => {
        let {appState} = this.state;

        if (appState == nextAppState) return;

        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
        }
        this.setState({ appState: nextAppState });
    }

    handleDisconnectedPeripheral(data) {
        let peripherals = this.state.peripherals;
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals });
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    handleUpdateValueForCharacteristic(data) {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals;
        var id = peripheral.id;
        var name = peripheral.name;

        if (!peripherals.has(id) && name && name.startsWith('9room')) {
            console.log('Got ble peripheral', peripheral);
            peripherals.set(id, peripheral);
            this.setState({ peripherals });
        }
    }

    scanBLE = () => {
        this.startScan();
        setTimeout(() => {
            this.stopScan();

            let {peripherals} = this.state;
            if (peripherals.size == 0) {
                this.startScan();

                setTimeout(() => {
                    this.stopScan();
                }, 3200);
            }
        }, 3500);
    }

    startScan = () => {
        if (!this.state.scanning) {
            this.setState({ peripherals: new Map(), isLoaded: true });

            BleManager.scan([], 3, true).then(() => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
    }

    stopScan = () => {
        BleManager.stopScan()
            .then(() => {
                console.log('Scan stopped');
                this.setState({ scanning: false });
            });
    }

    connectToPeripheral = async (peripheral) => {
        if (!peripheral) {
            return;
        }

        if (peripheral.connected) {
            BleManager.disconnect(peripheral.id);
        } else {
            const id = peripheral.id;
            const name = peripheral.name;

            if (!name.startsWith(TARGET_BLE_DEVICE_NAME)) return;

            await AsyncStorage.setItem('9room@device_uuid', id);

            this.props.navigation.navigate('BLEMenu', {uuid: id});
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.scanBLE();

        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 3500);
    }

    render() {
        let { peripherals, scanning, isLoaded, refreshing } = this.state;
        let list = Array.from(peripherals.values());

        if (!isLoaded) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.scroll} />
                    <ActivityIndicator size="large" color="red" />
                </View>
            );
        }


        let Peripherals = list.map(p => {
            let name = p.name;
            if (name == undefined || name == null || name == '') name = 'N/A';
            return (
                <TouchableOpacity onPress={() => { this.connectToPeripheral(p) }}>
                    <View style={styles.row}>
                        {/* <Image source={BLUETOOTH_ICON} style={styles.bleIconImage} /> */}
                        <Text style={styles.peripheralNameText}>Bluetooth device: </Text>
                        <Text style={(name.lenght > 16 ? styles.peripheralLongNameText : styles.peripheralNameText)}>{name}</Text>
                    </View>
                </TouchableOpacity>
            )
        });

        //if (list.length == 0) Peripherals = (<ActivityIndicator size="large" color="red" />);

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
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.goBack()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={BACK_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Image style={{ width: width / 3, height: height / 12 - 15 }} source={LOGO_IMAGE} />
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView
                            style={styles.scroll}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        >
                            {(list.length != 0) && Peripherals}
                            {/* {scanning && <ActivityIndicator size="large" color="red" />} */}
                        </ScrollView>
                    </View>
                    <Footer/>
                </Drawer>
            </SafeAreaView>
        );
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
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: width,
        height: height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        backgroundColor: 'lightgrey',
        borderBottomColor: "#bbbbbb",
        borderBottomWidth: 0.4,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    peripheralNameText: {
        fontSize: width / 20,
        textAlign: 'center',
        color: '#333333',
        padding: 10,
        marginBottom: width / 15
    },
    peripheralLongNameText: {
        fontSize: width / 25,
        textAlign: 'center',
        color: '#333333',
        padding: 10,
        marginBottom: width / 15
    },
    bleIconImage: {
        width: width / 6,
        height: width / 6,
        tintColor: 'lightskyblue'
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
    drawerContainer: {
        flex: 1,
    },
});
