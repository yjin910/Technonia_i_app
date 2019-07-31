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
import PropTypes from "prop-types";

const { width, height } = Dimensions.get('window');

export default class SignInScreen extends React.Component {

    static navigationOptions = {
        title: 'TEMS',
        headerStyle: {
            backgroundColor: '#1a3f95',
        },
        headerTintColor: '#fff',
    };

    static propTypes = {
        toSignUpScreen: PropTypes.func.isRequired,
        toProfileScreen: PropTypes.func.isRequired,
        resetPassword: PropTypes.func.isRequired
    };

    state = {
        id: undefined,
        pw: undefined
    }

    storeID = async (id) => {
        try {
            await AsyncStorage.setItem('TEMS@id', id);
            const toProfileScreen = this.props.toProfileScreen;
            toProfileScreen(id);
        } catch {
            alert('failed to store id');
        }
    }

    validateLogin = async (id) => {
        //TODO validate log in

        this.storeID(id);
    }

    render() {
        const { toSignUpScreen, resetPassword } = this.props;

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
                                <Image style={styles.logoImage} source={require('../assets/icon.jpg')} />
                                <TextInput style={styles.inputBox}
                                    placeholder="ID"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onChangeText={(id) => this.setState({ id: id })}
                                    value={this.state.id}
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
                                <TouchableOpacity style={styles.loginButtonBox} onPress={() => this.validateLogin()}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                                <View>
                                    <Text onPress={toSignUpScreen} style={styles.touchableText}>Sign up</Text>
                                    <Text onPress={resetPassword} style={styles.touchableText}>Reset password</Text>
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
    touchableText: {
        fontSize: width / 20,
        fontWeight: '500',
        color: "#ffffff",
        textAlign: 'center'
    },
    textContainer: {
        width: width,
        height: width / 3
    }
});
