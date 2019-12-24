import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import { Auth } from 'aws-amplify';
import { StackActions, NavigationActions } from 'react-navigation';

import I18n from '../i18n';


const { width, height } = Dimensions.get('window');
const LOGO_IMAGE = require('../../assets/logo.png')

export default class SignUpScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            name: ""
        }
    }

    _addEmail = (email) => {
        this.setState({email: email});
    }

    _addPassword = (text) => {
        this.setState({ password: text });
    }

    _addName = (text) => {
        this.setState({ name: text });
    }

    alertSuccess = async () => {
        let {email} = this.state;

        Alert.alert(
            'Sign up success',
            'Please check your email to confirm the sign up',
            [
                { text: 'OK', onPress: () => {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: 'Verification',
                            params: { email: email }
                        })],
                    });

                    this.props.navigation.dispatch(resetAction);

                } , style: 'default' }
            ],
            { cancelable: false },
        );
    }

    alertError = (err) => {
        Alert.alert(
            'Sign up failed',
            'Please try again later',
            [{ text: 'OK', onPress: () => console.log(err), style: 'default' }],
            { cancelable: false },
        );
    }

    _signUp = async () => {
        const { email, password, name } = this.state;

        if (email && password && name) {
            // check if the length of the password is less than 8
            if (password.length < 8) {
                Alert.alert(
                    I18n.t('passwordTooShort'),
                    I18n.t('minPasswordLen'),
                    [{ text: 'OK', onPress: () => console.log('Password too short!'), style: 'default' }],
                    { cancelable: false },
                );

                return;
            }

            // check if the email address includes the '@' character.
            if (!email.includes('@')) {
                Alert.alert(
                    I18n.t('invalidEmailFormat'),
                    I18n.t('fullEmailAddressRequired'),
                    [{ text: 'OK', onPress: () => console.log('Please input the full email address!'), style: 'default' }],
                    { cancelable: false },
                );

                return;
            }

            Auth.signUp({
                username: email,
                password: password,
                attributes: {
                    email: email,
                    name: name
                }
            }).then((data) => {
                console.log(data);
                this.alertSuccess();
            }).catch(err => {
                this.alertError(err);
            });
        } else {
            console.log('All attributes should be filled in');
        }
    }

    render() {
        let navigate = this.props.navigation.navigate;

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
                                <StatusBar
                                    BackgroundColor="1a3f95"
                                    barStyle="light-content"
                                />
                                <Image style={styles.logoImage}
                                    source={LOGO_IMAGE} />
                                <TextInput style={styles.inputBox}
                                    placeholder="Email address"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onSubmitEditing={() => { this.password.focus() }}
                                    onChangeText={this._addEmail}
                                    autoCapitalize={'none'}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    placeholderTextColor="#1a3f95"
                                    onChangeText={this._addPassword}
                                    ref={(input) => this.password = input}
                                    autoCapitalize={'none'}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Name"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={this._addName}
                                    autoCapitalize={'none'}
                                />
                                <TouchableOpacity style={styles.buttonBox} onPress={() => this._signUp()}>
                                    <Text style={styles.buttonText}>Signup</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonBox} onPress={() => navigate('Login')}>
                                    <Text style={styles.buttonText}>Sign In</Text>
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
        justifyContent: 'center'
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
    },
    logoImage: {
        width: height / 3,
        height: height / 10,
        marginBottom: height / 10,
        marginTop: height / 7
    }
});