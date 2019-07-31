import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from 'react-native';

let utils = require('./BLEUtil');

const { width, height } = Dimensions.get('window');

export default class GeigerNameSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deviceName: '',
            uuid: ''
        }

        this.sendDeviceName = this.sendDeviceName.bind(this);
    }

    sendDeviceName = async () => {
        const { deviceName, uuid } = this.state;
        if (uuid == '') {
            uuid = await AsyncStorage.getItem('TEMS@device_uuid');
        }
        utils.sendData_deviceName(uuid, deviceName);
    }

    componentDidMount = () => {
        const uuid = this.props.navigation.getParam('uuid', '');
        this.setState({uuid: uuid});
    }

    render() {
        return (
                <View style={styles.container}>
                    <TextInput style={styles.inputBox}
                        placeholder="Target Geiger Name"
                        placeholderTextColor="#1a3f95"
                        selectionColor="#fff"
                        keyboardType="email-address"
                        onChangeText={(deviceName) => this.setState({ deviceName: deviceName })}
                        value={this.state.deviceName}
                    />
                    <TouchableOpacity style={styles.buttonBox} onPress={() => this.sendDeviceName()}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
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
    inputBox: {
        width: width * 4 / 5,
        height: height / 15,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: width / 25,
        color: '#ffffff',
        marginVertical: 5
    },
    buttonBox: {
        width: width * 4 / 5,
        height: height / 15,
        backgroundColor: '#a8a9ad',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: "#ffffff",
        textAlign: 'center'
    }
});
