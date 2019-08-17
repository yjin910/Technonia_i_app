import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';
import { Circle, Text, G } from 'react-native-svg'

import DataText from './DataText'
import LoadingGraph from './LoadingGraph'
import LabelText from './LabelText'
import NoData from './NoData'
import ListViewButton from './ListViewButton'
import ListViewScreen from './ListViewScreen'


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

export default class HumidityGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_h: [],
            times: [],
            yAxisData: [],
            minGrid: 0,
            maxGrid: 0,
            isLoaded: false,
            isListViewMode: false
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
    }

    static propTypes = {
        humidityData: PropTypes.array.isRequired //TODO need to use this data, not hard-coded data
    };

    componentDidMount = () => {
        this.setData();
    }

    changeListViewMode = () => {
        let { isListViewMode } = this.state;
        this.setState({ isListViewMode: !isListViewMode });
    }

    setData = () => {
        let raw_data = [
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "h": "55" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "h": "60" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "h": "58" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "h": "57" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "h": "53" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "h": "55" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "h": "60" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "h": "63" }
        ]

        let data_h = [];
        let times = [];
        let yAxisData = [];

        let min = raw_data[0]['h'];
        let max = raw_data[0]['h'];

        for (let i = 0; i < raw_data.length; i++) {
            let d = raw_data[i];
            let h = d['h'];
            let timeData = new Date(d['time_val']);

            if (h) {
                let humi = parseFloat(h)
                if (humi > max) max = humi;
                if (humi < min) min = humi;
                data_h.push({ x: timeData, y: humi });

                yAxisData.push(humi);

                if (!times.includes(timeData)) times.push(timeData);
            }
        }

        this.setState({ data_h: data_h, yAxisData: yAxisData, times: times, minGrid: min, maxGrid: max, isLoaded: true });
    }

    /**
     * Log out an event after zooming
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
        let { data_h, times, yAxisData, minGrid, maxGrid, isLoaded, isListViewMode } = this.state;

        if (!isLoaded) {
            //this.setData();

            return (
                <LoadingGraph />
            )
        }

        if (data_h.length == 0) {
            return (
                <NoData />
            )
        } else {
            let data = [
                {
                    data: data_h,
                    svg: { stroke: 'blue' },
                }
            ]

            let minVal = parseFloat(minGrid);
            let maxVal = parseFloat(maxGrid);

            const Decorator = ({ x, y, data }) => {
                return data[0]['data'].map((value, index) => {
                    //stroke = index === (data.length - 1) ? 'rgb(255, 68, 68)' : 'rgb(26, 188, 156)';
                    if (value.y == minGrid) {
                        return (
                            <G>
                                <Circle
                                    key={uuidv1()}
                                    cx={x(value.x)}
                                    cy={y(value.y)}
                                    r={2}
                                    stroke={'red'}
                                    fill={'white'}
                                />
                                <Text
                                    key={uuidv1()}
                                    x={x(value.x)}
                                    y={y(value.y) + 15}
                                    style={{ width: 20 }}>
                                    {value.y}
                                </Text>
                            </G>
                        )
                    } else if (value.y == maxGrid) {
                        return (
                            <G>
                                <Circle
                                    key={uuidv1()}
                                    cx={x(value.x)}
                                    cy={y(value.y)}
                                    r={2}
                                    stroke={'red'}
                                    fill={'white'}
                                />
                                <Text
                                    key={uuidv1()}
                                    x={x(value.x)}
                                    y={y(value.y) - 5}
                                    style={{ width: 20 }}>
                                    {value.y}
                                </Text>
                            </G>
                        )
                    }
                })
            }

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
                            <ScrollView
                                scrollEnabled={true}
                                indicatorStyle={'white'}
                                maximumZoomScale={1.5}
                                minimumZoomScale={0.5}
                                bouncesZoom={true}
                            >
                                <View style={styles.listViewButtonContainer}>
                                    <ListViewButton changeListView={this.changeListViewMode} />
                                </View>
                                <LabelText types='h' />
                                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                                    <YAxis
                                        data={yAxisData}
                                        style={{ width: width / 6 }}
                                        contentInset={contentInset}
                                        svg={{
                                            fill: 'grey',
                                            fontSize: 10,
                                        }}
                                        min={minVal}
                                        max={maxVal}
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
                                        gridMin={minVal}
                                        gridMax={maxVal}
                                    >
                                        <Grid />
                                        <Decorator />
                                    </LineChart>
                                </View>
                                <DataText currentHumi={data_h[data_h.length - 1]['y']} types={'h'} />
                                {isListViewMode && data_h.map(d => {
                                    let valueStr = d['y'] + ' %'
                                    let timeStr = moment(d['x']).format('HH:mm:ss');
                                    return (<ListViewScreen valueStr={valueStr} timeStr={timeStr} key={uuidv1()} />)
                                })}
                            </ScrollView>
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
        flex: 1,
        marginBottom: height / 5
    },
    containerForGraphAndXAxis: {
        flex: 1,
        marginLeft: 10
    },
    listViewButtonContainer: {
        flex: 1 / 2
    }
});
