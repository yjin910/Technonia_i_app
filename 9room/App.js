import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Amplify from 'aws-amplify';

import LoginScreen from './src/cognito/Login'
import SignUpScreen from './src/cognito/Register'
import GeigerGraph from './src/graph/GeigerGraph'

import awsConfig from './src/cognito/config';

Amplify.configure(awsConfig);

const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignUpScreen },
  GeigerGraph: { screen: GeigerGraph },
});

let Container = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  render() {
    return (<Container />)
  }
}
