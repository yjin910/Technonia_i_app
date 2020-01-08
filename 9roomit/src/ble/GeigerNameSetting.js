import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeEventEmitter,
    NativeModules,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import Drawer from 'react-native-drawer'
import uuidv1 from 'uuid/v1';
import { StackActions, NavigationActions } from 'react-navigation';

import DrawerButton from '../graph/components/DrawerButton'
import Footer from '../Footer'

let utils = require('./BLEUtil');


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BLUETOOTH_ICON = require('../../assets/icon_bluetooth.png');
const MAIN_GEIGER_ICON = require('../../assets/main_geiger.png');
const BACK_IMAGE = require('../../assets/back.png');
const MENU_IMAGE = require('../../assets/menu.png');
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

export default class GeigerNameSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deviceName: '',
            uuid: '',
            peripherals: new Map(),
            scanning: false,
            isLoaded: false,
            refreshing: false
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.selectPeripheral = this.selectPeripheral.bind(this);

        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.navigateToBLESettings = this.navigateToBLESettings.bind(this);
        this.goBack = this.goBack.bind(this);
        this.logOut_async = this.logOut_async.bind(this);

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);

        this.onRefresh = this.onRefresh.bind(this);

        this._successDisconnect = this._successDisconnect.bind(this);
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
            <SafeAreaView style={styles.drawerContainer}>
                <View style={styles.drawerContainer}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
    }

    logOut_async = async () => {
        this.disconnectDevice();

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
        this.disconnectDevice();

        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Main', { email: email });
    }

    navigateToHelpScreen = () => {
        this.disconnectDevice();
        this.closeDrawer();
        this.props.navigation.navigate('Help');
    }

    navigateToCopyrightScreen = () => {
        this.disconnectDevice();
        this.closeDrawer();
        this.props.navigation.navigate('Copyright');
    }

    navigateToBLESettings = () => {
        this.disconnectDevice();
        this.closeDrawer();
        console.log('navigate to ble setting screen');
        this.props.navigation.navigate('BLEManaer');
    }

    navigateToProfileScreen = async () => {
        this.disconnectDevice();
        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Profile', { email: email });
    }

    _successDisconnect = () => {
        console.log('disconnected successfully');
    }

    disconnectDevice = async () => {
        let uuid = await AsyncStorage.getItem('9room@device_uuid');
        utils.disconnectBLEDevice(uuid, this._successDisconnect);
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }

    componentDidMount = () => {
        const uuid = this.props.navigation.getParam('uuid', '');
        this.setState({ uuid: uuid, isLoaded: true });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

        this.startScan();
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

    handleStopScan() {
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    handleDiscoverPeripheral(peripheral) {
        var peripherals = this.state.peripherals;

        if (!peripherals.has(peripheral.id)) {
            console.log('Got ble peripheral', peripheral);
            peripherals.set(peripheral.id, peripheral);
            this.setState({ peripherals })
        }
    }

    startScan() {
        this.setState({ scanning: true });
        utils.startScan();
    }

    selectPeripheral = async (peripheral) => {
        if (!peripheral || peripheral.name == '') {
            return;
        }

        let {uuid} = this.state;
        if (uuid == '') {
            uuid = await AsyncStorage.getItem('9room@device_uuid');
        }

        const name = peripheral.name;

        utils.sendData_deviceName(uuid, name);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.startScan();

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
            //TODO if (name && name != '') {}
            if (name == undefined || name == null || name == '') name = 'N/A';
            if (name.length > 16) {
                name = name.split(' ')[0];
                if (name.length > 16) name = name.slice(0, 15);
            }

            let img = (name.startsWith('BLE_Gamma:') ? MAIN_GEIGER_ICON : BLUETOOTH_ICON);
            return (
                <TouchableOpacity onPress={() => { this.selectPeripheral(p) }}>
                    <View style={styles.row}>
                        <Image source={img} style={styles.bleIconImage} />
                        <Text style={styles.peripheralNameText}>{name}</Text>
                    </View>
                </TouchableOpacity>
            )
        });

        if (list.length == 0) Peripherals = (<ActivityIndicator size="large" color="red" />);

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
                            style={styles.scroll}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        >
                            {(list.length != 0) && Peripherals}
                            {scanning && <ActivityIndicator size="large" color="red" />}
                        </ScrollView>
                        <Footer/>
                    </View>
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
