import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View
} from 'react-native'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';

import TemperatureGraph from './TemperatureGraph'
import HumidityGraph from './HumidityGraph'
import PlotScreen from './Plot'


const INTERVAL_TIME = 300000;

export default class GraphScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_t: [],
            data_h: [],
            isLoaded: false
        }
    }

    componentDidMount = () => {
        this._isLoaded();

        this.setInterval();
    }

    setInterval = () => {
        this._timer = setInterval(() => {
            //TODO
            console.log('Hello')
        }, INTERVAL_TIME);

        //TODO this._timer = this._timer.bind(this);
    }

    removeInterval = () => {
        clearInterval(this._timer);
    }

    componentWillUnmount = () => {
        this.clearInterval();
    }

    fetchData_Async = async (deviceNum) => {
        const url = 'http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8080/getdata?';

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    //TODO
                }
            )
            .catch((error) => {
                console.log(error);
            });
    }

    _isLoaded = () => {
        this.setState({ isLoaded: true });
    }

    /**
     * Log out an example event after zooming
     *
     * @param event
     * @param gestureState
     * @param zoomableViewEventObject
     */
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
        console.log('\n\n-------------');
        console.log('Event: ', event);
        console.log('GestureState: ', gestureState);
        console.log('ZoomableEventObject: ', zoomableViewEventObject);
        console.log('');
        console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}\n`);
    };

    render() {
        let { data_t, data_h, isLoaded } = this.state;

        if (isLoaded) {
            const Temperature = (props) => (<TemperatureGraph temperatureData={props.screenProps.temperatureData} />);
            const Humidity = (props) => (<HumidityGraph humidityData={props.screenProps.humidityData} />);
            const PlotScreen = (prps) => (<PlotScreen />);

            const AppNavigator = createMaterialTopTabNavigator({
                Temperature,
                Humidity,
                PlotScreen
            });

            const GraphApp = createAppContainer(AppNavigator);

            return (
                <SafeAreaView style={styles.root}>
                    <GraphApp screenProps={{ temperatureData: data_t, humidityData: data_h }} />
                </SafeAreaView>
            )
        } else {
            return (
                <View style={styles.root}></View>
            );
        }
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
});
