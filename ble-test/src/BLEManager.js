import React from 'react';
import { Platform } from 'react-native';
import { BleManager } from "react-native-ble-plx"

import BluetoothScanner from './BluetoothScanner';


const targetDeviceName = '';

export default class BluetoothManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: ''
        }
    }

    componentDidMount = () => {
        this.bleManager = new BleManager();

        if (Platform.OS === 'ios') {
            this.bleManager.onStateChange((state) => {
                if (state === 'PoweredOn') this.startScan(null, null);
            });
        } else {
            this.startScan(null, null);
        }
    }

    /**
     * Start BLE scan.
     *
     * The BleManager.startDeviceScan() method takes 3 arguments:
     *      1) UUIDs    = Array<UUID> - An array of string, where each string is UUID of BLE Service.
     *      2) options  = ScanOptions - Optional configuration for scanning operation.
     *      3) listener = (error, scannedDevice) => void  - Function which will be called for every scanned device.
     *
     * @param {uuid_array} Array An array of string, where each string is UUID of BLE Service.
     * @param {options} ScanOptions Optional configuration for scanning operation.
     */
    startScan = (uuid_array, options) => {
        this.bleManager.startDeviceScan(uuid_array, options, (err, device) => {
            if (err) {
                this.error(err.message)
            } else {
                console.log('Found: ' + device.name);

                // check the device name
                if (device.name === targetDeviceName) {
                    this.info("Connecting to TI Sensor");
                    this.stopScan();

                    //TODO
                    device.connect()
                        .then((device) => {
                            this.info("Discovering services and characteristics")
                            return device.discoverAllServicesAndCharacteristics()
                        })
                        .then((device) => {
                            this.info("Setting notifications")
                            return this.setupNotifications(device)
                        })
                        .then(() => {
                            this.info("Listening...")
                        }, (error) => {
                            this.error(error.message)
                        })
                }

            }
        });
    }

    stopScan = () => {
        this.bleManager.stopDeviceScan();
    }

    setupNotifications = async (device) => {
        for (const id in this.sensors) {
            const service = this.serviceUUID(id)
            const characteristicW = this.writeUUID(id)
            const characteristicN = this.notifyUUID(id)

            const characteristic = await device.writeCharacteristicWithResponseForService(
                service, characteristicW, "AQ==" /* 0x01 in hex */
            )

            device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
                if (error) {
                    this.error(error.message)
                    return
                }
                this.updateValue(characteristic.uuid, characteristic.value)
            })
        }
    }

    info = (message) => {
        this.setState({ info: message })
    }

    error = (message) => {
        this.setState({ info: "ERROR: " + message })
    }

    render() {
        //TODO
        return (<BluetoothScanner />);
    }
}
