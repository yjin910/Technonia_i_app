import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
    PanResponder,
    Animated,
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';
import { Circle, Text, G, Rect, Line } from 'react-native-svg'

import DataText from './DataText'
import LoadingGraph from './LoadingGraph'
import LabelText from './LabelText'
import NoData from './NoData'
import ListViewScreen from './ListViewScreen'


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

export default class TempHumiGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isTooltipMode: false,
            infoIndex: 0
        }

        this.changeInfoIndex = this.changeInfoIndex.bind(this);
    }

    static propTypes = {
        temperatureData: PropTypes.array.isRequired,
        humidityData: PropTypes.array.isRequired,
        t: PropTypes.array.isRequired,
        h: PropTypes.array.isRequired,
        min_t: PropTypes.number,
        max_t: PropTypes.number,
        min_h: PropTypes.number,
        max_h: PropTypes.number,
        isListViewMode: PropTypes.bool.isRequired
    };

    componentDidMount = () => {
        this._isLoaded();
    }

    componentWillMount = () => {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                //TODO when the user touched the screen
            },
            onPanResponderMove: (ev, gestureState) => {
                //TODO response to the move
                console.log(ev.nativeEvent.locationX);
            },
            onPanResponderRelease: (ev, gestureState) => {
                //TODO when the user release the touch
                //console.log(ev.nativeEvent.locationX);
                let { infoIndex } = this.state;
                let range = width / 3 * 2;
                let dataLength = this.props.temperatureData.length;
                let change = gestureState.dx;

                if (change > 0) {
                    let offset = range / dataLength;
                    console.log('offset: ' + offset);
                    let movement = change / offset;
                    console.log('movement: ' + movement);
                    movement = parseInt(movement);
                    if (infoIndex != dataLength - 1) {
                        let newIndex = infoIndex + movement;

                        if (newIndex > dataLength - 1) this.setState({ infoIndex: dataLength - 1 });
                        else this.setState({ infoIndex: newIndex });
                    }
                } else {
                    change *= -1;
                    let offset = range / dataLength;
                    console.log('offset: ' + offset);
                    let movement = change / offset;
                    console.log('movement: ' + movement);
                    movement = parseInt(movement);
                    if (infoIndex != 0) {
                        let newIndex = infoIndex - movement;

                        if (newIndex < 0) this.setState({ infoIndex: 0 })
                        else this.setState({ infoIndex: newIndex });
                    }
                }

            },
            onPanResponderTerminate: (evt, gestureState) => {
                //TODO teminate moving
            }
        });
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

    changeInfoIndex = (index) => {
        this.setState({ infoIndex: index });
    }

    render() {
        let { isLoaded, infoIndex } = this.state;
        let { temperatureData, humidityData, t, h, min_h, max_h, min_t, max_t, isTooltipMode, isListViewMode } = this.props;

        if (!isLoaded) {
            return (
                <LoadingGraph />
            )
        }

        if (temperatureData.length == 0 && humidityData.length == 0) {
            return (
                <NoData />
            )
        } else {
            let data = [
                {
                    data: temperatureData,
                    svg: { stroke: 'red' },
                },{
                    data: humidityData,
                    svg: { stroke: 'blue' },
                }
            ]

            let startDateT = moment(temperatureData[0]['x']).format('YYYY년 MM월 DD일 HH:mm');
            let endDateT = moment(temperatureData[temperatureData.length - 1]['x']).format('YYYY년 MM월 DD일 HH:mm');

            let startDateH = moment(humidityData[0]['x']).format('YYYY년 MM월 DD일 HH:mm');
            let endDateH = moment(humidityData[humidityData.length - 1]['x']).format('YYYY년 MM월 DD일 HH:mm');

            let startDate = (temperatureData[0]['x'] > humidityData[0]['x']) ? startDateH : startDateT;
            let endDate = (temperatureData[temperatureData.length - 1]['x'] > humidityData[humidityData.length - 1]['x']) ? endDateT : endDateH;

            let middleIndexT = temperatureData.length / 2;
            let middleIndexH = humidityData.length / 2;
            let middleIndex = (middleIndexT > middleIndexH) ? middleIndexH : middleIndexT;

            const TemperatureGraphDecorator = ({ x, y, data }) => {
                return data[0]['data'].map((value, index) => {
                    let x1 = x(value.x);
                    let y1 = y(value.y);

                    if (value.y == min_t || value.y == max_t) {
                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x1}
                                    cy={y1}
                                    r={2}
                                    stroke={'red'}
                                    fill={'white'}
                                    onPress={(event) => {
                                        const { pageX, pageY, locationX, locationY, } = event.nativeEvent;

                                        console.log(pageX);
                                        console.log(pageY);
                                        console.log(locationX);
                                        console.log(locationY);
                                        console.log(`Point (${x1}, ${y1}) is pressed`);
                                        this.changeInfoIndex(index);
                                    }}
                                />
                            </G>
                        )
                    } else {
                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x1}
                                    cy={y1}
                                    r={1}
                                    stroke={'red'}
                                    fill={'red'}
                                    onPress={(event) => {
                                        const { pageX, pageY, locationX, locationY, } = event.nativeEvent;

                                        console.log(pageX);
                                        console.log(pageY);
                                        console.log(locationX);
                                        console.log(locationY);

                                        console.log(`Point (${x1}, ${y1}) is pressed`);
                                        this.changeInfoIndex(index);
                                    }}
                                />
                            </G>
                        )
                    }
                })
            }

            const HumidityGraphDecorator = ({ x, y, data }) => {
                return data[1]['data'].map((value, index) => {
                    let x1 = x(value.x);
                    let y1 = y(value.y);

                    if (value.y == min_h || value.y == max_h) {
                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x1}
                                    cy={y1}
                                    r={2}
                                    stroke={'blue'}
                                    fill={'white'}
                                    onPress={(event) => {
                                        const { pageX, pageY, locationX, locationY, } = event.nativeEvent;

                                        console.log(pageX);
                                        console.log(pageY);
                                        console.log(locationX);
                                        console.log(locationY);
                                        console.log(`Point (${x1}, ${y1}) is pressed`);
                                        this.changeInfoIndex(index);
                                    }}
                                />
                            </G>
                        )
                    } else {
                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x1}
                                    cy={y1}
                                    r={1}
                                    stroke={'blue'}
                                    fill={'blue'}
                                    onPress={(event) => {
                                        const { pageX, pageY, locationX, locationY, } = event.nativeEvent;
                                        console.log(pageX);
                                        console.log(pageY);
                                        console.log(locationX);
                                        console.log(locationY);
                                        console.log(`Point (${x1}, ${y1}) is pressed`);
                                        this.changeInfoIndex(index);
                                    }}
                                />
                            </G>
                        )
                    }
                })
            }

            const BubbleTooltip = ({ x, y, data }) => {
                let targetDataT = data[0]['data'][infoIndex];
                let targetDataH = data[1]['data'][infoIndex];

                let x1 = x(targetDataT.x);
                let y1 = y(targetDataT.y);
                let x2 = x1;
                let y2 = y1;
                let rect_x, rect_y;
                let rect_width = width / 5;
                let rect_height = width / 15;

                let x1_h = x(targetDataH.x);
                let y1_h = y(targetDataH.y);
                let x2_h = x1_h;
                let y2_h = y1_h;
                let rect_x_h, rect_y_h;

                let lowestY = (min_t < min_h) ? y(min_t) + 15 : y(min_h) + 15;

                let textX, textY;
                let textX_h, textY_h;

                let avgY = (y(min_t) + y(max_t)) / 2
                let avgY_h = (y(min_h) + y(max_h)) / 2

                if (y1 > avgY) {
                    y2 -= 10;
                    rect_y = y2 - rect_height;

                    y2_h -= 10;
                    rect_y_h = y2_h - rect_height;

                    textY = (rect_y + y2) / 2 + 3;
                    textY_h = (rect_y_h + y2_h) / 2 + 3;
                } else {
                    y2 += 10;
                    rect_y = y2;

                    y2_h += 10;
                    rect_y_h = y2_h;

                    textY = (rect_y * 2 + rect_height) / 2 + 3;
                    textY_h = (rect_y_h * 2 + rect_height) / 2 + 3;
                }

                if (infoIndex > middleIndex) {
                    x2 -= 10;
                    rect_x = x2 - rect_width;

                    x2_h -= 10;
                    rect_x_h = x2_h - rect_width;

                    textX = (x2 + rect_x) / 2;
                    textX_h = (x2_h + rect_x_h) / 2;
                } else {
                    x2 += 10;
                    rect_x = x2;

                    x2_h += 10;
                    rect_x_h = x2_h;

                    textX = (rect_x * 2 + rect_width) / 2;
                    textX_h = (rect_x_h * 2 + rect_width) / 2;
                }

                return (
                    <G key={uuidv1()} {...this._panResponder.panHandlers} >
                        <Line
                            key={uuidv1()}
                            x1={`${x1_h}`}
                            x2={`${x2_h}`}
                            y1={`${y1_h}`}
                            y2={`${y2_h}`}
                            stroke='black'
                            strokeWidth='2'
                        />
                        <Rect key={uuidv1()} width={rect_width} height={rect_height} x={rect_x_h} y={rect_y_h} stroke='black' fill='white' strokeWidth='2' />
                        <Text key={uuidv1()}
                            x={textX_h}
                            y={textY_h}
                            fontSize='15'
                            textAnchor="middle"
                            fill='black'
                        >
                            {`${targetDataH.y} %`}
                        </Text>
                        <Line
                            key={uuidv1()}
                            x1={`${x1}`}
                            x2={`${x2}`}
                            y1={`${y1}`}
                            y2={`${y2}`}
                            stroke='black'
                            strokeWidth='2'
                        />
                        <Rect key={uuidv1()} width={rect_width} height={rect_height} x={rect_x} y={rect_y} stroke='black' fill='white' strokeWidth='2' />
                        <Text key={uuidv1()}
                            x={textX}
                            y={textY}
                            fontSize='15'
                            textAnchor="middle"
                            fill='black'
                        >
                            {`${targetDataT.y} °C`}
                        </Text>
                        <Line
                            key={uuidv1()}
                            x1={`${x1}`}
                            x2={`${x1}`}
                            y1={`${y1_h}`}
                            y2={`${lowestY}`}
                            stroke='black'
                            strokeWidth='2'
                        />
                        <Circle
                            cx={x1}
                            cy={lowestY}
                            r={4}
                            stroke={'black'}
                            fill={'black'}
                        />
                    </G>
                );
            }

            return (
                <SafeAreaView style={styles.root}>
                    <Animated.View style={styles.container}>
                        <ScrollView
                            scrollEnabled={true}
                            indicatorStyle={'white'}
                        >
                            <LabelText types='th' />
                            <Animated.View style={{ marginLeft: 10, flexDirection: 'row' }}>
                                <YAxis
                                    data={t.concat(h)}
                                    style={{ width: width / 6 }}
                                    contentInset={contentInset}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 10,
                                    }}
                                    min={(min_t < min_h ? min_t : min_h)}
                                    max={(max_t < max_h ? max_h : max_t)}
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
                                    gridMin={(min_t < min_h ? min_t : min_h)}
                                    gridMax={(max_t < max_h ? max_h : max_t)}
                                    animate={true}
                                    key={uuidv1()}
                                >
                                    <Grid />
                                    <TemperatureGraphDecorator />
                                    <HumidityGraphDecorator />
                                    {isTooltipMode && <BubbleTooltip />}
                                </LineChart>
                            </Animated.View>
                            <DataText
                                currentTemp={temperatureData[temperatureData.length - 1]['y']}
                                currentHumi={humidityData[humidityData.length - 1]['y']}
                                types={'th'}
                                minTemp={min_t}
                                maxTemp={max_t}
                                minHumi={min_h}
                                maxHumi={max_h}
                                startDate={startDate}
                                endDate={endDate}
                            />
                            {isListViewMode && temperatureData.map(d => {
                                let valueStr = d['y'] + ' °C'
                                let timeStr = moment(d['x']).format('HH:mm:ss');
                                return (<ListViewScreen valueStr={valueStr} timeStr={timeStr} key={uuidv1()} />)
                            })}
                            {isListViewMode && humidityData.map(d => {
                                let valueStr = d['y'] + ' %'
                                let timeStr = moment(d['x']).format('HH:mm:ss');
                                return (<ListViewScreen valueStr={valueStr} timeStr={timeStr} key={uuidv1()} />)
                            })}
                        </ScrollView>
                    </Animated.View>
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
