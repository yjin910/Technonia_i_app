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
    ScrollView
} from 'react-native';
import { Auth } from 'aws-amplify';
import { SignIn } from 'aws-amplify-react-native';

const { width, height } = Dimensions.get('window');

export default class SignInScreen extends SignIn {
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

    _signUp = async () => {
        const { email, password, name } = this.state;

        if (email && password && name) {
            Auth.signUp({
                email,
                password,
                attributes: {
                    email: email,
                    name: name
                }
            }).then((data) => {
                console.log(data);
            }).catch(err => console.log(err));
        } else {
            console.log('All attributes should be filled in');
        }
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
                                <StatusBar
                                    BackgroundColor="1a3f95"
                                    barStyle="light-content"
                                />
                                <Image style={styles.logoImage}
                                    source={require('../../assets/logo.png')} />
                                <TextInput style={styles.inputBox}
                                    placeholder="Email address"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="email-address"
                                    onSubmitEditing={() => { this.password.focus() }}
                                    onChangeText={this._addEmail}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    placeholderTextColor="#1a3f95"
                                    onChangeText={this._addPassword}
                                    ref={(input) => this.password = input}
                                />
                                <TextInput style={styles.inputBox}
                                    placeholder="Name"
                                    placeholderTextColor="#1a3f95"
                                    selectionColor="#fff"
                                    keyboardType="name-phone-pad"
                                    onChangeText={this._addName}
                                />
                                <TouchableOpacity style={styles.buttonBox} onPress={this._signUp.bind(this)}>
                                    <Text style={styles.buttonText}>Signup</Text>
                                </TouchableOpacity>
                                <View style={styles.textContainer}>
                                    <TouchableOpacity onPress={() => navigateTo('Login')}>
                                        <Text style={styles.toLoginPageButton}>Sign In</Text>
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
        justifyContent: 'center'
    },
    textContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    toLoginPageButton: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: '500'
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
        width: height / 6,
        height: height / 6,
        marginBottom: height / 10,
        marginTop: height / 20
    }
});