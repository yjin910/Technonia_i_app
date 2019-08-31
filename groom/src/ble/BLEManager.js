import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ListView,
    ScrollView,
    AppState,
    AsyncStorage
} from 'react-native';
import BleManager from 'react-native-ble-manager';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const TARGET_BLE_DEVICE_NAME = '9roomer_';


export default class BLEManagerScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: '',
        }

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({ showAlert: false });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
    }

    handleAppStateChange = (nextAppState) => {
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
        if (!this.state.scanning) {
            this.setState({ peripherals: new Map() });
            BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                this.setState({ scanning: true });
            });
        }
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

            const devices = this.props.navigation.getParam('devices', '');

            let foundTarget = false;

            for (let i = 0; i < devices.length; i++) {
                let deviceID = TARGET_BLE_DEVICE_NAME + devices[i];

                if (name.startsWith(TARGET_BLE_DEVICE_NAME)) foundTarget = true;
            }

            if (foundTarget) {
                await AsyncStorage.setItem('TEMS@device_uuid', id);
                //TODO change state.
            } else {
                return;
            }
        }
    }

    render() {
        let { scanning, peripherals } = this.state;
        let list = Array.from(peripherals.values());
        let dataSource = ds.cloneWithRows(list);

        return (
            <View style={styles.container}>
                <TouchableHighlight style={{ marginTop: 40, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.startScan()}>
                    <Text>Scan Bluetooth ({scanning ? 'on' : 'off'})</Text>
                </TouchableHighlight>
                <ScrollView style={styles.scroll}>
                    {(list.length == 0) &&
                        <View style={{ flex: 1, margin: 20 }}>
                            <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                        </View>
                    }
                    <ListView
                        enableEmptySections={true}
                        dataSource={dataSource}
                        renderRow={(item) => {
                            return (
                                <TouchableHighlight onPress={() => this.connectToPeripheral(item)}>
                                    <View style={styles.row}>
                                        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                                        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 10 }}>{item.id}</Text>
                                    </View>
                                </TouchableHighlight>
                            );
                        }}
                    />
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: window.width,
        height: window.height
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10,
        backgroundColor: 'lightgrey',
        borderBottomColor: "#bbbbbb",
        borderBottomWidth: 0.4,
    },
});
