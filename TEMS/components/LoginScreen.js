import React from 'react';
import WelcomeScreen from './WelcomScreen';
import SignInScreen from './SignInScreen';
import SignupScreen from './SignupScreen';

export default class LoginScreen extends React.Component {
    state = {
        isLoaded: false,
        screen: 'signin'
    }

    /**
     * Change the screen to sign up screen.
     */
    toSignUpScreen = () => {
        this.setState({screen: 'signup'});
    }

    /**
     * Navigate to profile screen.
     * @param id ID of the user
     */
    toProfileScreen = async (id) => {
        this.props.navigation.navigate('Profile', {id: id});
    }

    resetPassword = async () => {
        //TODO
    }

    componentDidMount = () => {
        this.setState({isLoaded: true});
    }

    /**
     * Change the screen to sign in screen.
     */
    toSignInScreen = () => {
        this.setState({screen: 'signin'});
    }

    render() {
        let { isLoaded, screen } = this.state;

        if (isLoaded) {
            switch (screen) {
                case 'signup' :
                    return (
                        <SignupScreen />
                    );
                case 'signin' :
                    return (
                        <SignInScreen
                            toSignUpScreen={this.toSignUpScreen}
                            toProfileScreen={this.toProfileScreen}
                            resetPassword={this.resetPassword}
                        />
                    );
                default:
                    this.toSignInScreen();
            }
        } else {
            return (<WelcomeScreen />)
        }
    }
}
