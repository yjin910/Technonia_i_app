import React from 'react';
import { BleManager } from "react-native-ble-plx"

import BluetoothScanner from './BluetoothScanner';


const uuids = [];
const manager = new BleManager();

export default class BluetoothManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //TODO
        }

        this.char_uuid = ''
    }

    componentDidMount = () => {
        this.bleManager = manager;

        this.startScan();
    }

    /**
     * Start BLE scan.
     *
     * The BleManager.startDeviceScan() method takes 3 arguments:
     *      1) UUIDs    = Array<UUID> - An array of string, where each string is UUID of BLE Service.
     *      2) options  = ScanOptions - Optional configuration for scanning operation.
     *      3) listener = (error, scannedDevice) => void  - Function which will be called for every scanned device.
     */
    startScan = () => {
        this.bleManager.startDeviceScan(uuids, {}, (err, device) => {
            if (err) {
                //TODO alert error
                alert("Error occurred while scanning ble devices");
            } else {
                //TODO
            }
        });
    }

    stopScan = () => {
        this.bleManager.stopDeviceScan();
    }

    render() {
        //TODO
        return (<BluetoothScanner />);
    }
}
