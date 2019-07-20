import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import BluetoothManager from './src/BLEManager';

const AppStackNavigator = createStackNavigator({
  Manager: { screen: BluetoothManager }
});

export default class App extends React.Component {
  render() {
    let Container = createAppContainer(AppStackNavigator);

    return (<Container />);
  }
}
