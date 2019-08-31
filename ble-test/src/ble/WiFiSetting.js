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
    ScrollView,
    Image
} from 'react-native';


const { width, height } = Dimensions.get('window');

let util = require('./BLEUtil');

export default class WiFiSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wifi: '',
            pw: '',
            uuid: undefined
        }

        this.sendWiFiSettings = this.sendWiFiSettings.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    sendWiFiSettings = async () => {
        let { wifi, pw, uuid } = this.state;

        if (uuid == '') {
            uuid = await AsyncStorage.getItem('9room@device_uuid');
        }
        util.sendData_wifi(uuid, wifi, pw, this.goBack);
    }

    getAndSetUUID = () => {
        const uuid = this.props.navigation.getParam('uuid', '');
        this.setState({ uuid: uuid });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    componentDidMount = () => {
        this.getAndSetUUID();
    }

    render() {
        let {uuid} = this.state;
        if (!uuid) {
            this.getAndSetUUID();
        }

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 0, android: width / 3 })}
                style={styles.keyboardAvoidingContainer}
                behavior={"padding"}
                enabled>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <View style={styles.container}>
                                <Image style={styles.logoImage} source={require('../../assets/icon.png')} />
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
    keyboardAvoidingContainer: {
        flex: 1
    },
    container: {
        backgroundColor: '#1a3f95',
        flexGrow: 1,
        alignItems: 'center',
    },
    logoImage: {
        width: height / 6,
        height: height / 6,
        marginBottom: height / 10,
        marginTop: height / 20
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
