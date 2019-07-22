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
    AppState
} from 'react-native';
import BleManager from 'react-native-ble-manager';

import BluetoothScanner from './BluetoothScanner';


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const BLE_NOTIFICATION_TIMEOUT = 200;
const BLE_RETRIEVE_SERVICE_TIMEOUT = 900;

export default class BluetoothManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: ''
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

    retrieveConnected() {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
            }
        });
    }

    connectToPeripheral = (peripheral) => {
        if (!peripheral) {
            return;
        }

        if (peripheral.connected) {
            BleManager.disconnect(peripheral.id);
        } else {
            const id = peripheral.id;

            BleManager.connect(id)
                .then(() => {
                    let peripherals = this.state.peripherals;
                    let p = peripherals.get(id);
                    if (p) {
                        p.connected = true;
                        peripherals.set(id, p);
                        this.setState({ peripherals });
                    }
                    //TODO debugging message
                    console.log('Connected to ' + id);
                    alert('Connected to ' + id);

                    setTimeout(() => {

                        BleManager.retrieveServices(id)
                            .then((peripheralInfo) => {
                                //TODO fill in the service uuid and characteristic uuid
                                let service_uuid = '';
                                let characteristic_uuid = '';

                                // set timeout to start notification for given service
                                setTimeout(() => {
                                    BleManager.startNotification(id, service_uuid, characteristic_uuid)
                                        .then(() => {
                                            alert(peripheralInfo);
                                            console.log(peripheralInfo);
                                        })
                                        .catch((error) => {
                                            console.log('Notification error', error);
                                        })
                                }, BLE_NOTIFICATION_TIMEOUT);
                            })
                            .catch((error) => {
                                console.log(error);
                                alert('Error in BleManager.retrieveServices()'); //TODO
                            })

                    }, BLE_RETRIEVE_SERVICE_TIMEOUT);
                })
                .catch((error) => {
                    console.log('Connection error', error);
                });
        }
    }

    render() {
        let list = Array.from(this.state.peripherals.values());
        let dataSource = ds.cloneWithRows(list);


        return (
            <View style={styles.container}>
                <TouchableHighlight style={{ marginTop: 40, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.startScan()}>
                    <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{ marginTop: 0, margin: 20, padding: 20, backgroundColor: '#ccc' }} onPress={() => this.retrieveConnected()}>
                    <Text>Retrieve connected peripherals</Text>
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
                            const color = item.connected ? 'green' : '#fff';
                            return (
                                <TouchableHighlight onPress={() => this.connectToPeripheral(item)}>
                                    <View style={[styles.row, { backgroundColor: color }]}>
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

        //TODO return (<BluetoothScanner />);
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
        margin: 10
    },
});
