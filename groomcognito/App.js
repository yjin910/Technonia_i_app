import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import LoginScreen from './src/Login'
import SignInScreen from './src/Register'

import Amplify from 'aws-amplify';
import awsConfig from './src/config';

Amplify.configure(awsConfig);

const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignInScreen },
});

let Container = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  render() {
    return (<Container />)
  }
}
