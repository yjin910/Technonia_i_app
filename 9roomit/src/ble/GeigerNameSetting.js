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
    SafeAreaView
} from 'react-native';
import Drawer from 'react-native-drawer'
import uuidv1 from 'uuid/v1';

import DrawerButton from '../graph/components/DrawerButton'
import { StackActions, NavigationActions } from 'react-navigation';

let utils = require('./BLEUtil');


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BLUETOOTH_ICON = require('../../assets/icon_bluetooth.png');
const MAIN_GEIGER_ICON = require('../../assets/main_geiger.png');
const BACK_IMAGE = require('../../assets/back.png');
const MENU_IMAGE = require('../../assets/menu.png');

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
            isLoaded: false
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

        this.goBack = this.goBack.bind(this);
        this.logOut_async = this.logOut_async.bind(this);

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
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

    sendDeviceName = async (deviceName, uuid) => {
        //const { deviceName, uuid } = this.state;
        let id = uuid
        if (id == '') {
            id = await AsyncStorage.getItem('9room@device_uuid');
        }
        utils.sendData_deviceName(id, deviceName);
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
        if (!peripheral) {
            return;
        }

        const id = await AsyncStorage.getItem('9room@device_uuid');
        const name = peripheral.name;

        this.sendDeviceName(name, id);
    }

    render() {
        let { peripherals, scanning, isLoaded } = this.state;
        let list = Array.from(peripherals.values());

        if (!isLoaded) {
            //TODO activity indicator
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
            if (name == undefined || name == null || name == '') name = 'bluetooth device';
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
                    type='static'
                    tapToClose={true}
                    openDrawerOffset={0.35}
                    styles={drawerStyles}
                    side={'right'}
                >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.goBack()}
                                    style={{ tintColor: 'white', width: width / 10, height: width / 10, marginRight: width / 30 }}>
                                    <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={BACK_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.headerTitle}>Device Name</Text>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 10, height: width / 10 }}>
                                    <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView style={styles.scroll}>
                            {(list.length != 0) && Peripherals}
                            {(list.lenght == 0) && <ActivityIndicator size="large" color="red" />}
                        </ScrollView>
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
        //margin: 10,
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
    drawerContainer: {
        flex: 1,
    },
});
