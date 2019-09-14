import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

BleManager.start({ showAlert: false });

const WIFI_NAME_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const WIFI_PW_SERVICE_UUID = '4fafc202-1fb5-459e-8fcc-c5c9c331914b';
const WIFI_NAME_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const WIFI_PW_CHARACTERISTIC_UUID = 'bed5483e-36e1-4688-b7f5-ea07361b26a8';
const DEVICE_NAME_SERVICE_UUID = "4fafc203-1fb5-459e-8fcc-c5c9c331914b";
const DEVICE_NAME_CHARACTERISTIC_UUID = "bec5483e-36e1-4688-b7f5-ea07361b26a8";


let sendData_wifi = (device_uuid, wifi, pw) => {
    if (device_uuid == '') {
        alert('device not connected');
        return;
    }

    const wifi_data = stringToBytes(wifi);

    BleManager.write(device_uuid, WIFI_NAME_SERVICE_UUID, WIFI_NAME_CHARACTERISTIC_UUID, wifi_data, wifi_data.length + 1)
        .then(() => {
            const pw_data = stringToBytes(pw);

            BleManager.write(device_uuid, WIFI_PW_SERVICE_UUID, WIFI_PW_CHARACTERISTIC_UUID, pw_data, pw_data.length + 1)
                .catch((err) => { alert('error::write pw = ' + pw) });
        })
        .catch((err) => { alert('error::write wifi') });
}

let sendData_deviceName = (device_uuid, deviceName) => {
    if (device_uuid == '') {
        alert('device not connected');
        return;
    }

    const deviceName_data = stringToBytes(deviceName);

    BleManager.write(device_uuid, DEVICE_NAME_SERVICE_UUID, DEVICE_NAME_CHARACTERISTIC_UUID, deviceName_data, deviceName_data.length + 1)
        .then(() => {
            console.log('success');
        })
        .catch((err) => { alert(err) });
}


let connectToBLEDevice = (uuid, next, handleError) => {
    BleManager.connect(uuid)
        .then(() => {
            next(uuid);
        })
        .catch((error) => {
            console.log('Connection error', error);
            handleError(error);
        });
}

let disconnectBLEDevice = (uuid, next) => {
    BleManager.disconnect(uuid)
        .then(() => {
            next();
        })
        .catch((err) => {
            console.log(err);
        })
}


let startScan = () => {
    BleManager.scan([], 3, true).then(() => {
        console.log('Scanning...');
    });
}

let getConnectedItems = () => {
    BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
    });
}

module.exports.connectBLEDevice = connectToBLEDevice;
module.exports.sendData_wifi = sendData_wifi;
module.exports.sendData_deviceName = sendData_deviceName;
module.exports.startScan = startScan;
module.exports.getConnectedItems = getConnectedItems;
module.exports.disconnectBLEDevice = disconnectBLEDevice;