import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppState,
    AsyncStorage,
    TouchableOpacity,
    Dimensions
} from 'react-native';

let util = require('./BLEUtil');


const { width, height } = Dimensions.get('window');

export default class BLEMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uuid: ''
        }
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({ showAlert: false });

        this.sendData = this.sendData.bind(this);
        this.getDeviceNumber();
    }

    getDeviceNumber = async () => {
        const uuid = await AsyncStorage.getItem('TEMS@device_uuid');
        this.setState({uuid: uuid});
    }

    handleConnectionError = (err) => {
        console.log(err);
    }

    setConnectedDevice = (uuid) => {
        this.setState({ device: uuid });
    }

    connectDevice = async () => {
        let {uuid} = this.state;

        if (uuid == '') {
            await this.getDeviceNumber();
            uuid = this.state.uuid;
        }

        util.connectDevice(uuid, this.setConnectedDevice, this.handleConnectionError);
    }

    disconnectDevice = () => {
        const { uuid } = this.state;
        if (uuid == '')
            return;

        BleManager.disconnect(uuid)
            .then(() => {
                this.setState({ uuid: '' });
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            })
    }

    navigateScreen = (screen) => {
        const { uuid } = this.state;
        this.props.navgation.navigate(screen, { uuid: uuid });
    }

    render() {
        return(
            <View>
                <TouchableOpacity onPress={() => this.navigateScreen('WiFiSetting')}>
                    <Text>WiFi Setting</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.navigateScreen('DeviceNumberSetting')}>
                    <Text>Device Setting</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        //
    },
    buttonText: {
        //
    }
});
