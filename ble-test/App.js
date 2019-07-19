import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import BluetoothScanner from './src/BluetoothScanner';

const AppStackNavigator = createStackNavigator({
  Scanner: { screen: BluetoothScanner }
});

export default class App extends React.Component {
  render() {
    let Container = createAppContainer(AppStackNavigator);

    return (<Container />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
