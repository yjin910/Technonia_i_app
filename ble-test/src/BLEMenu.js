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

        this.navigateToGeigerScreen = this.navigateToGeigerScreen.bind(this);
        this.navigateToWiFiScreen = this.navigateToWiFiScreen.bind(this);
        this.setConnectedDevice = this.setConnectedDevice.bind(this);
        this.handleConnectionError = this.handleConnectionError.bind(this);
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);

        this.connectDevice();
    }

    getDeviceNumber = async () => {
        await AsyncStorage.getItem('TEMS@device_uuid', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({ uuid: res });
            }
        });
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

        util.connectBLEDevice(uuid, this.setConnectedDevice, this.handleConnectionError);
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

    navigateToWiFiScreen = () => {
        const { uuid } = this.state;
        this.props.navigation.navigate('WiFiSetting', { uuid: uuid });
    }

    navigateToGeigerScreen() {
        const { uuid } = this.state;
        this.props.navigation.navigate('GeigerNameSetting', { uuid: uuid });
    }

    render() {
        let {isConnected} = this.state;

        if (isConnected) {
            return (
                <View style={styles.container}>
                    <Image style={styles.logoImage} source={require('../assets/icon.png')} />
                    <TouchableOpacity onPress={() => this.navigateToWiFiScreen()} style={styles.button}>
                        <Text style={styles.buttonText}>WiFi Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.navigateToGeigerScreen()} style={styles.button}>
                        <Text style={styles.buttonText}>Device Setting</Text>
                    </TouchableOpacity>
                </View>
            );
        }

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
        paddingVertical: width / 20,
        marginVertical: width / 20,
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
        textAlign: 'center',
        paddingVertical: width / 10
    }
});
