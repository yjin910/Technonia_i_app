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
    ScrollView,
    BackHandler,
    Alert
} from 'react-native';
import { Auth } from 'aws-amplify';
import { StackActions, NavigationActions } from 'react-navigation';
import Checkbox from 'react-native-modest-checkbox'

import I18n from '../i18n';


const { width, height } = Dimensions.get('window');
const LOGO_IMAGE = require('../../assets/logo.png')

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    state = {
        email: undefined,
        pw: undefined,
        autoLogin: false,
        storeEmail: false,
    }

    storeAsync = async (email, pw) => {
        try {
            let {autoLogin, storeEmail} = this.state;

            if (autoLogin) {
                await AsyncStorage.setItem('9room@autoLogin', 'true');
            }

            if (storeEmail) {
                await AsyncStorage.setItem('9room@pw', pw);
            }
            await AsyncStorage.setItem('9room@email', email);

        } catch(err) {
            alert('Failed to store email');
            console.log(err);
        }
    }

    getEmail_async = async () => {
        const email = await AsyncStorage.getItem('9room@email');
        const pw = await AsyncStorage.getItem('9room@pw');

        if (email && pw) {
            this.setState({email: email, pw: pw});
        }
    }

    componentDidMount = () => {
        this.getEmail_async();

        if (Platform.OS == 'android') {

            /* add the event listeners for the back button handling */

            this.focusListener = this.props.navigation.addListener('didFocus', () => {
                this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
                    this.handleBackButtonPressed();
                    return true;
                });
            });

            this.blurListener = this.props.navigation.addListener('willBlur', payload => {
                this.backhandler.remove();
            })
        }
    }

    componentWillUnmount = () => {
        if (Platform.OS == 'android') {
            this.focusListener.remove();
            this.blurListener.remove();
            this.backhandler.remove();
        }
    }

    _signIn = async () => {
        const { email, pw } = this.state;


        if (email && pw) {
            // check the length of the password
            if (pw.length < 8) {
                alert(I18n.t('minPasswordLen'));
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

            Auth.signIn(email, pw).then(user => {
                console.log(user);
                this.storeAsync(email, pw);

                if (Platform.OS == 'android') {
                    // remove the event listeners to prevent unexpected errors
                    this.focusListener.remove();
                    this.blurListener.remove();
                    this.backhandler.remove();
                }

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({
                        routeName: 'Main',
                        params: { email: email }
                    })],
                });

                this.props.navigation.dispatch(resetAction);
            }).catch(err => {
                console.log(err);
                let msg = '';

                // check the error code
                if (err.code == 'UserNotConfirmedException') {
                    // This error happens if the user didn't finish the confirmation step.
                    msg = I18n.t('comfirmationNotFinished');

                } else if (err.code === 'PasswordResetRequiredException') {
                    // This error happens when the password is reset in the Cognito console.
                    // In this case you need to call forgotPassword to reset the password
                    msg = I18n.t('passwordResetRequired');

                } else if (err.code === 'NotAuthorizedException') {
                    // This error happens when the incorrect password is provided
                    msg = I18n.t('passwordInvald');

                } else if (err.code == 'UserNotFoundException') {
                    // This error happens when the supplied username/email does not exist
                    msg = I18n.t('emailInvalid');

                } else {
                    msg = 'Sign in failed';
                }

                alert(msg);
            })
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
                                <Image style={styles.logoImage} source={LOGO_IMAGE} />
                                <TextInput style={styles.inputBox}
                                    placeholder="Email address"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={(email) => this.setState({ email: email })}
                                    value={this.state.email}
                                    onSubmitEditing={() => this.password.focus()}
                                    autoCapitalize={'none'}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    placeholderTextColor="#1a3f95"
                                    onChangeText={(pw) => this.setState({ pw: pw })}
                                    value={this.state.pw}
                                    ref={(input) => this.password = input}
                                    autoCapitalize={'none'}
                                />
                                <TouchableOpacity style={styles.loginButtonBox} onPress={() => this._signIn()}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.loginButtonBox} onPress={() => navigate('Signup')}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row'}}>
                                    <Checkbox
                                        label={I18n.t('autoLogin')}
                                        onChange={(checked) => {
                                            if (checked) {
                                                if (this.state.storeEmail) {
                                                    this.setState({ autoLogin: !this.state.autoLogin })
                                                } else {
                                                    this.setState({ autoLogin: !this.state.autoLogin, storeEmail: true })
                                                }
                                            } else {
                                                this.setState({ autoLogin: !this.state.autoLogin })
                                            }
                                        }}
                                        checked={this.state.autoLogin}
                                        checkboxStyle={{ tintColor: 'white' }}
                                        containerStyle={{ padding: 10, flexDirection: 'row' }}
                                        labelStyle={{ color: 'white' }}
                                    />
                                    <Checkbox
                                        label={I18n.t('storeEmail')}
                                        onChange={(checked) => {
                                            if (this.state.autoLogin) {
                                                if (!checked) {
                                                    this.setState({ storeEmail: !this.state.storeEmail })
                                                }
                                            } else {
                                                this.setState({ storeEmail: !this.state.storeEmail })
                                            }
                                        }}
                                        checked={this.state.storeEmail}
                                        checkboxStyle={{ tintColor: 'white' }}
                                        containerStyle={{ padding: 10, flexDirection: 'row' }}
                                        labelStyle={{ color: 'white' }}
                                    />
                                </View>
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
    loginButtonBox: {
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
