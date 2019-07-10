import React from 'react';
import WelcomeScreen from './WelcomScreen';
import SignInScreen from './SignInScreen';

export default class LoginScreen extends React.Component {
    state = {
        isLoaded: false
    }

    toSignUpScreen = async () => {
        //TODO
    }

    toProfileScreen = async (id) => {
        //TODO
    }

    resetPassword = async () => {
        //TODO
    }

    componentDidMount = () => {
        this.setState({isLoaded: true});
    }

    render() {
        let { isLoaded } = this.state;

        if (isLoaded) {
            return (
            <SignInScreen
                toSignUpScreen={this.toSignUpScreen}
                toProfileScreen={this.toProfileScreen}
                resetPassword={this.resetPassword}
            />
            );
        } else {
            return (<WelcomeScreen />)
        }
    }
}
