import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View
} from 'react-native'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';

import TemperatureGraph from './TemperatureGraph'
import HumidityGraph from './HumidityGraph'
import GeigerGraph from './GeigerGraph'


const INTERVAL_TIME = 300000;

export default class GraphScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_t: [],
            data_h: [],
            data_g: [],
            ts: [],
            hs: [],
            gs: [],
            min_t: 0,
            min_h: 0,
            min_g: 0,
            max_t: 0,
            max_h: 0,
            max_g: 0,
            isLoaded: false
        }
    }

    componentDidMount = () => {
        let deviceNum = '18';
        this.fetchData_Async(deviceNum)

        this.setInterval();
    }

    setInterval = () => {
        let deviceNum = '18';

        this._timer = setInterval(() => {
            console.log('fetch data start');
            this.fetchData_Async(deviceNum);
        }, INTERVAL_TIME);
    }

    removeInterval = () => {
        clearInterval(this._timer);
    }

    componentWillUnmount = () => {
        this.clearInterval();
    }

    fetchData_Async = async (deviceNum) => {
        const url = `http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/getdata?u=${deviceNum}`;
        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let num = result.length;
                    let data_t = [];
                    let data_h = [];
                    let data_g = [];

                    let ts = [];
                    let hs = [];
                    let gs = [];

                    let min_t, min_h, min_g, max_t, max_h, max_g;

                    let isNotFirst_t = false;
                    let isNotFirst_h = false;
                    let isNotFirst_g = false;

                    for (let i = 0; i < num; i++) {
                        let d = result[i];
                        let type = d['type'];
                        let time_val = new Date(d['time']);

                        switch(type) {
                            case 't' :
                                let t = parseFloat(d['val']);
                                if (isNotFirst_t) {
                                    min_t = (min_t < t) ? min_t : t;
                                } else min_t = t;
                                if (max_t) {
                                    max_t = (max_t > t) ? max_t : t;
                                } else {
                                    max_t = t;
                                    isNotFirst_t = true;
                                }

                                data_t.push({ x: time_val, y: t });
                                ts.push(t);

                                break;
                            case 'h' :
                                let h = parseFloat(d['val']);

                                if (isNotFirst_h) {
                                    min_h = (min_h < h) ? min_h : h;
                                } else min_h = h;
                                if (isNotFirst_h) {
                                    max_h = (max_h > h) ? max_h : h;
                                } else {
                                    max_h = h;
                                    isNotFirst_h = true;
                                }

                                data_h.push({ x: time_val, y: h });
                                hs.push(h);

                                break;
                            case 'g' :
                                let g = parseFloat(d['val']);

                                if (isNotFirst_g) {
                                    min_g = (min_g < g) ? min_g : g;
                                } else min_g = g;
                                if (isNotFirst_g) {
                                    max_g = (max_g > g) ? max_g : g;
                                } else {
                                    max_g = g;
                                    isNotFirst_g = true;
                                }

                                data_g.push({ x: time_val, y: g });
                                gs.push(g);

                                break;
                        }
                    }

                    this.setState({
                        data_t: data_t,
                        data_h: data_h,
                        data_g: data_g,
                        ts: ts,
                        hs: hs,
                        gs: gs,
                        min_t: min_t,
                        min_h: min_h,
                        min_g: min_g,
                        max_t: max_t,
                        max_h: max_h,
                        max_g: max_g,
                        isLoaded: true
                    });
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
        let { data_t, data_h, data_g, ts, hs, gs, min_t, min_h, min_g, max_t, max_h, max_g, isLoaded } = this.state;

        if (isLoaded) {
            const Temperature = (props) => (<TemperatureGraph 
                temperatureData={props.screenProps.temperatureData} 
                t={props.screenProps.ts}
                min={props.screenProps.min_t}
                max={props.screenProps.max_t}
            />);
            const Humidity = (props) => (<HumidityGraph
                humidityData={props.screenProps.humidityData}
                h={props.screenProps.hs}
                min={props.screenProps.min_h}
                max={props.screenProps.max_h}
            />);
            const Geiger = (props) => (<GeigerGraph
                geigerData={props.screenProps.geigerData}
                g={props.screenProps.gs}
                min={props.screenProps.min_g}
                max={props.screenProps.max_g}
            />);

            const AppNavigator = createMaterialTopTabNavigator({
                Geiger,
                Temperature,
                Humidity,
            });

            const GraphApp = createAppContainer(AppNavigator);

            return (
                <SafeAreaView style={styles.root}>
                    <GraphApp screenProps={{ 
                        temperatureData: data_t,
                        humidityData: data_h,
                        geigerData: data_g,
                        ts: ts,
                        hs: hs,
                        gs: gs,
                        min_t: min_t,
                        min_h: min_h,
                        min_g: min_g,
                        max_t: max_t,
                        max_h: max_h,
                        max_g: max_g,
                    }} />
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
