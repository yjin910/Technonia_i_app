import React from 'react';
import {
  AsyncStorage
} from 'react-native';

import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen'

/* create default stack navigator */
const AppStackNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen }
});

/* create logged-in stack navigator */
const LoggedInStackNavigator = createStackNavigator({
  Profile: { screen: ProfileScreen }
});


export default class App extends React.Component {
  /**
   * Check if the user is logged in already.
   */
  checkIfLoggedIn = async () => {
    const id = await AsyncStorage.getItem('TEMS@id', undefined);

    if (id) this.setState({ isLoggedIn: true, id: id });
  }

  componentWillMount = () => {
    this.checkLoggedIn();
  }

  render() {
    const { isLoggedIn } = this.state;

    let Container;

    if (isLoggedIn) {
      Container = createAppContainer(LoggedInStackNavigator);
    } else {
      Container = createAppContainer(AppStackNavigator);
    }

    return (<Container />)
  }
}