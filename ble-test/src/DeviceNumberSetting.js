import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Platform,
    ScrollView
} from 'react-native';
import PropTypes from "prop-types";

let utils = require('./BLEUtil');

const { width, height } = Dimensions.get('window');

export default class DeviceNumberSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deviceNum: '',
            uuid: ''
        }
    }

    static propTypes = {
        device: PropTypes.string.isRequired,
        sendData: PropTypes.func.isRequired
    };

    sendDeviceNumber = () => {
        const { deviceNum, uuid } = this.state;
        if (uuid == '') {
            uuid = await AsyncStorage.getItem('TEMS@device_uuid');
        }
        utils.sendData_deviceNum(uuid, deviceNum);
    }

    componentDidMount = () => {
        const uuid = this.props.navigation.getParam('uuid', '');
        this.setState({uuid: uuid});
    }

    render() {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 0, android: width / 3 })}
                style={{ flex: 1 }}
                behavior={"padding"}
                enabled>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <View style={styles.container}>
                                <TextInput style={styles.inputBox}
                                    placeholder="Device Number"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="number-pad"
                                    onChangeText={(deviceNum) => this.setState({ deviceNum: deviceNum })}
                                    value={this.state.deviceNum}
                                />
                                <TouchableOpacity style={styles.buttonBox} onPress={() => this.sendDeviceNumber()}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAvoidingView>
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
