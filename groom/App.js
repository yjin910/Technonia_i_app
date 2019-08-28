import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import LoginScreen from './src/cognito/Login'
import SignUpScreen from './src/cognito/Register'
import GeigerGraph from './src/graph/GeigerGraph'
import TempHumiGraph from './src/graph/TempHumiGraph'
import ProfileScreen from './src/Profile'

import Amplify from 'aws-amplify';
import awsConfig from './src/cognito/config';

Amplify.configure(awsConfig);

const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignUpScreen },
  Geiger: { screen: GeigerGraph },
  TempHumiGraph: { screen: TempHumiGraph },
  Profile: {screen: ProfileScreen},
});

let Container = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  render() {
    return (<Container />)
  }
}
