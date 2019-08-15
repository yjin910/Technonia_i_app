import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import PropTypes from "prop-types";

import DataText from './DataText'
import LoadingGraph from './LoadingGraph'
import LabelText from './LabelText'


const { width, height } = Dimensions.get('window');

export default class TemperatureGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_t: [],
            times: [],
            yAxisData: [],
            minGrid: 0,
            maxGrid: 0
        }
    }

    static propTypes = {
        temperatureData: PropTypes.number.isRequired //TODO need to use this data, not the  hard-coded data
    };

    componentDidMount = () => {
        this.setData();
    }

    setData = () => {
        let raw_data = [
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "t": "24.71" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "t": "25.71" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "t": "24.73" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "t": "25.75" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "t": "26.77" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "t": "27.31" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "t": "28.19" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "t": "27.86" }
        ]

        let data_t = [];
        let times = [];
        let yAxisData = [];

        let min = raw_data[0]['t'];
        let max = raw_data[0]['t'];

        for (let i = 0; i < raw_data.length; i++) {
            let d = raw_data[i];
            let t = d['t'];
            let timeData = new Date(d['time_val']);

            if (t) {
                let temp = parseFloat(t)
                if (temp > max) max = temp;
                if (temp < min) min = temp;
                data_t.push({ x: timeData, y: temp });

                yAxisData.push(temp);

                if (!times.includes(timeData)) times.push(timeData);
            }
        }

        this.setState({ data_t: data_t, yAxisData: yAxisData, times: times, minGrid: min - 0.5, maxGrid: max + 0.5 });
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
        let { data_t, times, yAxisData, minGrid, maxGrid } = this.state;

        if (data_t.length == 0) {
            this.setData();

            return (
                <LoadingGraph />
            )
        } else {
            let data = [
                {
                    data: data_t,
                    svg: { stroke: 'red' },
                }
            ]

            const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

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
                            <LabelText types='t' />
                            <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                                <YAxis
                                    data={yAxisData}
                                    style={{ width: width / 6 }}
                                    contentInset={contentInset}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 10,
                                    }}
                                    min={minGrid - 5}
                                    max={maxGrid + 5}
                                    scale={scale.scale}
                                    //numberOfTicks={10}
                                    formatLabel={(value) => value}
                                />
                                <LineChart
                                    contentInset={contentInset}
                                    style={{ height: height / 5 * 2, width: width / 3 * 2 }}
                                    yAccessor={({ item }) => item.y}
                                    xAccessor={({ item }) => item.x}
                                    data={data}
                                    gridMin={minGrid}
                                    gridMax={maxGrid}
                                >
                                    <Grid />
                                </LineChart>
                                {//TODO}
                                {/* <View style={styles.containerForGraphAndXAxis}>
                                    <LineChart
                                        contentInset={contentInset}
                                        style={{ height: height / 5 * 2, width: width / 3 * 2 }}
                                        yAccessor={({ item }) => item.y}
                                        xAccessor={({ item }) => item.x}
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
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            rotation: 20,
                                            originY: 30,
                                            y: 5,
                                        }}
                                        xAccessor={({ item }) => item}
                                        scale={scale.scaleTime}
                                        numberOfTicks={6}
                                        style={{ marginHorizontal: -15, height: 20, width: width / 3 * 2 }}
                                        contentInset={contentInset}
                                        formatLabel={(value) => moment(value).format('HH:mm:ss')}
                                    />
                                </View> */}
                            </View>
                            <DataText currentTemp={data_t[data_t.length - 1]['y']} types={'t'} />
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
        width: width,
        height: height
    },
    zoomableView: {
        //padding: 10
        flex: 1,
        marginBottom: height / 5
    },
    containerForGraphAndXAxis: {
        flex: 1,
        marginLeft: 10
    }
});
