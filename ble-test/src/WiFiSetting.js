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


const { width, height } = Dimensions.get('window');

export default class WiFiSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wifi: '',
            pw: ''
        }
    }

    static propTypes = {
        device: PropTypes.string.isRequired,
        sendData: PropTypes.func.isRequired
    };

    sendWiFiSettings = () => {
        const { device, sendData } = this.props;
        const { wifi, pw } = this.state;

        sendData(device, wifi, pw);
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
                                    placeholder="Wi-Fi"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={(wifi) => this.setState({ wifi: wifi })}
                                    value={this.state.wifi}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Password"
                                    placeholderTextColor="#1a3f95"
                                    onChangeText={(pw) => this.setState({ pw: pw })}
                                    value={this.state.pw}
                                />
                                <TouchableOpacity style={styles.buttonBox} onPress={() => this.sendWiFiSettings()}>
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
