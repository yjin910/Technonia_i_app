import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'

import GraphScreen from './src/Graph'

const AppStackNavigator = createStackNavigator({
  Graph: {screen: GraphScreen}
});

let Container = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  render() {
    return (<Container />)
  }
}
