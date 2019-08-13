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


const { width, height } = Dimensions.get('window');

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        title: 'groom',
        headerStyle: {
            backgroundColor: '#1a3f95',
        },
        headerTintColor: '#fff',
    };

    state = {
        email: undefined,
        pw: undefined,
        user: {}
    }

    storeAsync = async (email, pw) => {
        try {
            await AsyncStorage.setItem('Groom@email', email);
            await AsyncStorage.setItem('Groom@pw', pw);
        } catch {
            alert('failed to store id');
        }
    }

    _signIn = async () => {
        const { email, pw } = this.state;

        if (pw.length < 8) alert('Minimum password length is 8!');

        if (email && pw) {
            Auth.signIn(email, pw).then(user => {
                this.setState({ user: user });
                await this.storeAsync(email, pw);

                //TODO Are we supposed to store user object in the AsyncStorage??
                // this.props.navigation.navigate('nextScreen')
            }).catch(err => {
                console.log(err);
            })
        }
    }


    render() {
        let navigate = this.props.navigation.navigate;

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
                                <Image style={styles.logoImage} source={require('../assets/logo.png')} />
                                <TextInput style={styles.inputBox}
                                    placeholder="Email address"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={(email) => this.setState({ email: email })}
                                    value={this.state.email}
                                    onSubmitEditing={() => this.password.focus()}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    placeholderTextColor="#1a3f95"
                                    onChangeText={(pw) => this.setState({ pw: pw })}
                                    value={this.state.pw}
                                    ref={(input) => this.password = input}
                                />
                                <TouchableOpacity style={styles.loginButtonBox} onPress={() => this._signIn()}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                                <View style={styles.signupTextContainer}>
                                    <TouchableOpacity onPress={() => navigate('Signup')}>
                                        <Text style={styles.signupButton}> Register </Text>
                                    </TouchableOpacity>
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
    },
    signupTextContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: width / 20,
        flexDirection: 'row'
    },
    signupButton: {
        color: "#ffffff",
        fontSize: width / 20,
        fontWeight: '500'
    }
});
