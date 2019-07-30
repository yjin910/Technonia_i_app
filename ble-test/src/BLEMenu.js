import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppState,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';

let util = require('./BLEUtil');


const { width, height } = Dimensions.get('window');

export default class BLEMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uuid: '',
            isConnected: false
        }
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({ showAlert: false });

        this.sendData = this.sendData.bind(this);
        this.getDeviceNumber();
        this.connectDevice();
    }

    getDeviceNumber = async () => {
        const uuid = await AsyncStorage.getItem('TEMS@device_uuid');
        this.setState({uuid: uuid});
    }

    handleConnectionError = (err) => {
        console.log(err);
    }

    setConnectedDevice = (uuid) => {
        this.setState({ device: uuid, isConnected: true });
    }

    connectDevice = async () => {
        let {uuid} = this.state;

        if (uuid == '') {
            await this.getDeviceNumber();
            uuid = this.state.uuid;
        }

        this.navigateScreen = this.navigateScreen.bind(this);
        util.connectDevice(uuid, this.setConnectedDevice, this.handleConnectionError);
    }

    disconnectDevice = () => {
        const { uuid } = this.state;
        if (uuid == '')
            return;

        BleManager.disconnect(uuid)
            .then(() => {
                this.setState({ uuid: '', isConnected: false });
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
        let {isConnected} = this.state;

        if (isConnected) {
            return (
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require('../assets/icon.png')} />
                    <TouchableOpacity onPress={() => this.navigateScreen('WiFiSetting')} style={styles.button}>
                        <Text style={styles.buttonText}>WiFi Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.navigateScreen('DeviceNumberSetting')} style={styles.button}>
                        <Text style={styles.buttonText}>Device Setting</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        this.connectDevice();

        return(
            <View style={styles.container}>
                <Image style={styles.logoImage} source={require('../assets/icon.png')} />
                <View>
                    <Text style={styles.notConnectedText}>Device not connected..</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a3f95',
        flexGrow: 1,
        alignItems: 'center',
    },
    button: {
        width: width / 5 * 4,
        height: height / 15,
        backgroundColor: '#a8a9ad',
        borderRadius: 25,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: "#ffffff",
        textAlign: 'center'
    },
    notConnectedText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: "#ffffff",
        textAlign: 'center'
    }
});
