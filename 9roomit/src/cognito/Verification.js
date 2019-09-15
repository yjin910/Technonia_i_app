import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    AsyncStorage,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Platform,
    ScrollView
} from 'react-native';
import { Auth } from 'aws-amplify';
import { StackActions, NavigationActions } from 'react-navigation';


const { width, height } = Dimensions.get('window');
const LOGO_IMAGE = require('../../assets/logo.png')

export default class VerificationScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    state = {
        verificationCode: undefined,
        user: {},
        email: ''
    }

    componentDidMount = () => {
        let email = this.props.navigation.getParam('email');
        this.setState({ email: email});
    }

    _verify = async () => {
        const { verificationCode, email } = this.state;

        if (verificationCode.length > 0) {
            Auth.confirmSignUp(email, verificationCode, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            }).then(data => {
                console.log(data)

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({
                        routeName: 'Login'
                    })],
                });

                this.props.navigation.dispatch(resetAction);
            }).catch(err => {
                console.log(err)
            });
        }
    }

    _resendCode = async () => {
        let {email} = this.state;

        Auth.resendSignUp(email).then(() => {
            alert('Code resent successfully');
        }).catch(e => {
            console.log(e);
        });
    }


    render() {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 0, android: width / 3 })}
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.root}
                enabled>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <View style={styles.container}>
                                <Image style={styles.logoImage} source={LOGO_IMAGE} />
                                <TextInput style={styles.inputBox}
                                    placeholder="Verification code"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={(verificationCode) => this.setState({ verificationCode: verificationCode })}
                                    value={this.state.verificationCode}
                                    autoCapitalize={'none'}
                                />
                                <TouchableOpacity style={styles.buttonBox} onPress={() => this._verify()}>
                                    <Text style={styles.buttonText}>Verify</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonBox} onPress={() => this._resendCode()}>
                                    <Text style={styles.buttonText}>Resend Code</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#1a3f95',
        flex: 1
    },
    container: {
        backgroundColor: '#1a3f95',
        flexGrow: 1,
        alignItems: 'center',
    },
    logoImage: {
        width: height / 3,
        height: height / 10,
        marginBottom: height / 10,
        marginTop: height / 7
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
