import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import BluetoothManager from './src/BLEManager';
import BLEMenu from './src/BLEMenu';
import WiFiSetting from './src/WiFiSetting'
import GeigerNameSetting from './src/GeigerNameSetting'

const AppStackNavigator = createStackNavigator({
  Manager: { screen: BluetoothManager },
  BLEMenu: { screen: BLEMenu },
  WiFiSetting: { screen: WiFiSetting },
  GeigerNameSetting: { screen: GeigerNameSetting }
});

export default class App extends React.Component {
  render() {
    let Container = createAppContainer(AppStackNavigator);

    return (<Container />);
  }
}
