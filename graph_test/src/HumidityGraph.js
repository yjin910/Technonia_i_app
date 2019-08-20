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
            isLoaded: false,
            isListViewMode: false
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
    }

    static propTypes = {
        humidityData: PropTypes.array.isRequired,
        h: PropTypes.array.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired
    };


    changeListViewMode = () => {
        let { isListViewMode } = this.state;
        this.setState({ isListViewMode: !isListViewMode });
    }

    componentDidMount = () => {
        this._isLoaded();
    }

    _isLoaded = () => {
        this.setState({ isLoaded: true });
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
        let { isLoaded, isListViewMode } = this.state;
        let { humidityData, h, min, max } = this.props;

        if (!isLoaded) {
            return (<LoadingGraph />);
        }

        if (humidityData.length == 0) {
            return (<NoData />);
        } else {
            let data = [
                {
                    data: humidityData,
                    svg: { stroke: 'blue' },
                }
            ]

            let startDate = moment(humidityData[0]['x']).format('MM/DD HH:mm');
            let endDate = moment(humidityData[humidityData.length - 1]['x']).format('MM/DD HH:mm');

            const Decorator = ({ x, y, data }) => {
                return data[0]['data'].map((value, index) => {
                    //stroke = index === (data.length - 1) ? 'rgb(255, 68, 68)' : 'rgb(26, 188, 156)';
                    if (value.y == min || value.y == max) {
                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x(value.x)}
                                    cy={y(value.y)}
                                    r={2}
                                    stroke={'blue'}
                                    fill={'white'}
                                />
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
                                        data={h}
                                        style={{ width: width / 6 }}
                                        contentInset={contentInset}
                                        svg={{
                                            fill: 'grey',
                                            fontSize: 10,
                                        }}
                                        min={min}
                                        max={max}
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
                                        gridMin={min}
                                        gridMax={max}
                                        animate={true}
                                    >
                                        <Grid />
                                        <Decorator />
                                    </LineChart>
                                </View>
                                <DataText 
                                    currentHumi={humidityData[humidityData.length - 1]['y']}
                                    types={'h'}
                                    minHumi={min}
                                    maxHumi={max}
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                                {isListViewMode && humidityData.map(d => {
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
