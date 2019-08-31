import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import LoginScreen from './src/cognito/Login'
import SignUpScreen from './src/cognito/Register'
import GeigerGraph from './src/graph/GeigerGraph'
import TempHumiGraph from './src/graph/TempHumiGraph'
import ProfileScreen from './src/Profile'
import BLEManagerScreen from './src/ble/BLEManager'
import BLEMenu from './src/ble/BLEMenu'
import WiFiSetting from './src/ble/WiFiSetting'
import GeigerNameSetting from './src/ble/GeigerNameSetting'

import Amplify from 'aws-amplify';
import awsConfig from './src/cognito/config';

Amplify.configure(awsConfig);

const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignUpScreen },
  Geiger: { screen: GeigerGraph },
  TempHumiGraph: { screen: TempHumiGraph },
  Profile: {screen: ProfileScreen},
  BLEManaer: {screen: BLEManagerScreen},
  BLEMenu: { screen: BLEMenu },
  WiFiSetting: { screen: WiFiSetting },
  GeigerNameSetting: { screen: GeigerNameSetting }
});

let Container = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  render() {
    return (<Container />)
  }
}
