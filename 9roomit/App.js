import React from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  View,
  StyleSheet
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import LoginScreen from './src/cognito/Login'
import SignUpScreen from './src/cognito/Register'
import MainScreen from './src/Main'
import ProfileScreen from './src/Profile'
import BLEManagerScreen from './src/ble/BLEManager'
import BLEMenu from './src/ble/BLEMenu'
import WiFiSetting from './src/ble/WiFiSetting'
import GeigerNameSetting from './src/ble/GeigerNameSetting'
import CopyrightScreen from './src/additional/CopyrightScreen'
import HelpScreen from './src/additional/HelpScreen'

import Amplify from 'aws-amplify';
import awsConfig from './src/cognito/config';

Amplify.configure(awsConfig);

const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Signup: { screen: SignUpScreen },
  Main: { screen: MainScreen },
  Profile: {screen: ProfileScreen},
  BLEManaer: {screen: BLEManagerScreen},
  BLEMenu: { screen: BLEMenu },
  WiFiSetting: { screen: WiFiSetting },
  GeigerNameSetting: { screen: GeigerNameSetting },
  Help: { screen: HelpScreen },
  Copyright: { screen: CopyrightScreen }
});

const AppStackNavigator_signedIn = createStackNavigator({
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
  BLEManaer: { screen: BLEManagerScreen },
  BLEMenu: { screen: BLEMenu },
  WiFiSetting: { screen: WiFiSetting },
  GeigerNameSetting: { screen: GeigerNameSetting },
  Login: { screen: LoginScreen },
  Signup: { screen: SignUpScreen },
  Help: { screen: HelpScreen },
  Copyright: { screen: CopyrightScreen }
});


export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    isLoaded: false,
  }

  checkLoggedIn = async () => {
    const id = await AsyncStorage.getItem('9room@email');

    if (id) {
      this.setState({ isLoggedIn: true, isLoaded: true });
    } else {
      this.setState({isLoaded: true});
    }
  }

  componentWillMount = () => {
    this.checkLoggedIn();
  }

  render() {
    const { isLoggedIn, isLoaded } = this.state;

    if (isLoaded) {
      let Container;

      if (isLoggedIn) {
        Container = createAppContainer(AppStackNavigator_signedIn);
      } else {
        Container = createAppContainer(AppStackNavigator);
      }

      return (<Container />)
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1a3f95'
  }
});