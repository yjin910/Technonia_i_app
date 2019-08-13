import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Text
} from 'react-native'
import { LineChart, XAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';


const { width, height } = Dimensions.get('window');


export default class GraphScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_t: [],
            data_h: [],
            times: [],
            minGrid: 0,
            maxGrid: 0
        }
    }

    componentDidMount = () => {
        this.setData();
    }

    setData = () => {
        let raw_data = [
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "t": "24.71" },
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "h": "55" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "t": "25.71" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "h": "60" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "t": "24.73" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "h": "58" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "t": "25.75" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "h": "57" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "t": "26.77" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "h": "53" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "t": "27.31" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "h": "55" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "t": "28.19" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "h": "60" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "t": "27.86" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "h": "63" }
        ]

        let data_t = [];
        let data_h = [];
        let times = [];

        let min = 0;
        let max = 0;

        for (let i = 0; i < raw_data.length; i++) {
            let d = raw_data[i];
            let t = d['t'];
            let h = d['h']
            let timeVal = d['time_val']
            let timeData = new Date(timeVal);

            if (t) {
                let temp = parseFloat(t)
                if (temp > max) max = temp;
                if (temp < min) min = temp;
                data_t.push({ x: timeData, y: temp });
            }

            if (h) {
                let humi = parseFloat(h)
                if (humi > max) max = humi;
                if (humi < min) min = humi;
                data_h.push({ x: timeData, y: humi });
            }

            if (!times.includes(timeData)) times.push(timeData);
        }

        this.setState({ data_t: data_t, data_h: data_h, times: times, minGrid: min, maxGrid: max + 2 });
    }

    /**
     * Log out an example event after zooming
     *
     * @param event
     * @param gestureState
     * @param zoomableViewEventObject
     */
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
        console.log('');
        console.log('');
        console.log('-------------');
        console.log('Event: ', event);
        console.log('GestureState: ', gestureState);
        console.log('ZoomableEventObject: ', zoomableViewEventObject);
        console.log('');
        console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);
    };

    render() {
        let { data_t, data_h, times, minGrid, maxGrid } = this.state;

        if (data_t == []) {
            this.setData();

            return (
                <View style={styles.loadingContainer}>
                    <Text>Please wait until the app receives the data</Text>
                </View>
            )
        } else {
            let data = [
                {
                    data: data_t,
                    svg: { stroke: 'red' },
                },
                {
                    data: data_h,
                    svg: { stroke: 'blue' },
                },
            ]

            return (
                <SafeAreaView style={styles.root}>
                    <View style={styles.container}>
                        <ReactNativeZoomableView
                            zoomEnabled={true}
                            maxZoom={1.5}
                            minZoom={0.5}
                            zoomStep={0.25}
                            initialZoom={1.0}
                            bindToBorders={true}
                            onZoomAfter={this.logOutZoomState}
                            style={styles.zoomableView}
                        >
                            <LineChart
                                style={{ height: height / 3 * 2, width: width }}
                                yAccessor={({item}) => item.y}
                                xAccessor={({item}) => item.x}
                                data={data}
                                gridMin={minGrid}
                                gridMax={maxGrid}
                            >
                                <Grid />
                            </LineChart>
                            <XAxis
                                data={times}
                                svg={{
                                    fill: 'black',
                                    fontSize: 8,
                                    fontWeight: 'bold',
                                    rotation: 20,
                                    originY: 30,
                                    y: 5,
                                }}
                                xAccessor={({ item }) => item}
                                scale={scale.scaleTime}
                                numberOfTicks={6}
                                style={{ marginHorizontal: -15, height: 20 }}
                                contentInset={{ left: 10, right: 25 }}
                                formatLabel={(value) => moment(value).format('HH:mm:ss')}
                            />
                        </ReactNativeZoomableView>
                    </View>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    zoomableView: {
        padding: 10
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center'
    }
});
