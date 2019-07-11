import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export default class SignupScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            password: '',
            password_confirm: ''
        }
    }

    static propTypes = {
        toSignInScreen: PropTypes.func.isRequired
    }

    sendUserInfo = async () => {
        try {
            const { id, password } = this.state;

            //TODO

        } catch (err) {
            console.log(err);
            alert('failed to sign up');
        }
    }

    _addId = (text) => {
        this.setState({ id: text });
    }

    _addPassword = (text) => {
        this.setState({ password: text });
    }

    _addPasswordConfirm = (text) => {
        this.setState({ password_confirm: text });
    }


    /* This method checks if the user filled all text inputs */
    checkIfTheUserFilledAllTextInput = async () => {
        const toSignInScreen = this.props.toSignInScreen;

        const { id, password, password_confirm } = this.state;

        if (id !== '') {
            if (password !== '') {
                if (password_confirm == password) {
                    //store the user information in the local storage
                    await this.sendUserInfo();

                    //navigate to the log in screen
                    toSignInScreen();
                }
            } else {
                alert('Please input password');
            }
        } else {
            alert('Please input your ID');
        }
    }

    render() {
        const toSignInScreen = this.checkIfTheUserFilledAllTextInput;
        const { toSignInScreen } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar
                    BackgroundColor="1a3f95"
                    barStyle="light-content"
                />
                <Image style={styles.logoImage}
                    source={require('../assets/icon.png')} />
                <TextInput style={styles.inputBox}
                    placeholder="ID"
                    placeholderTextColor="#1a3f95"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={() => { this.password.focus() }}
                    onChangeText={this._addId}
                />
                <TextInput style={styles.inputBox}
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#1a3f95"
                    onChangeText={this._addPassword}
                    ref={(input) => this.password = input}
                />
                <TextInput style={styles.inputBox}
                    placeholder="Password Confirm"
                    secureTextEntry={true}
                    placeholderTextColor="#1a3f95"
                    onChangeText={this._addPasswordConfirm}
                    ref={(input) => this.password = input}
                />
                <TouchableOpacity style={styles.buttonBox} onPress={() => toSignInScreen()}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.toLoginPageButton} onPress={() => toSignInScreen()} >
                        log in
                    </Text>
                </View>
            </View>
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