import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Animated,
    PanResponder
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';
import { Circle, Text, G, Rect, Line } from 'react-native-svg'

import DataText from './DataText'
import LoadingGraph from './LoadingGraph'
import LabelText from './LabelText'
import NoData from './NoData'
import ListViewButton from './ListViewButton'
import ListViewScreen from './ListViewScreen'
import TooltipButton from './TooltipButton';


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);

export default class GeigerGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isListViewMode: false,
            isTooltipMode: false,
            infoIndex: 0,
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
        this.changeInfoIndex = this.changeInfoIndex.bind(this);
        this.changeTooltipMode = this.changeTooltipMode.bind(this);
    }

    static propTypes = {
        geigerData: PropTypes.array.isRequired,
        g: PropTypes.array.isRequired,
        min: PropTypes.number,
        max: PropTypes.number
    };


    changeListViewMode = () => {
        let { isListViewMode } = this.state;
        this.setState({ isListViewMode: !isListViewMode });
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
                let {infoIndex} = this.state;
                let range = width / 3 * 2;
                let dataLength = this.props.geigerData.length;
                let change = gestureState.dx;

                if (change > 0) {
                    let offset = range / dataLength;
                    console.log('offset: ' +  offset);
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

                        if (newIndex < 0) this.setState({infoIndex: 0})
                        else this.setState({ infoIndex: newIndex });
                    }
                }

            },
            onPanResponderTerminate: (evt, gestureState) => {
                //TODO teminate moving
            }
        });
    }

    componentDidMount = () => {
        this._isLoaded();
    }

    _isLoaded = () => {
        this.setState({ isLoaded: true });
    }

    changeTooltipMode = () => {
        let { isTooltipMode } = this.state;
        this.setState({isTooltipMode: !isTooltipMode});
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
        this.setState({infoIndex: index});
    }

    render() {
        let { isLoaded, isListViewMode, infoIndex, isTooltipMode } = this.state;
        let { geigerData, g, min, max } = this.props;

        if (!isLoaded) {
            return (<LoadingGraph />);
        }

        if (geigerData.length == 0) {
            return (<NoData />);
        } else {
            let data = [
                {
                    data: geigerData,
                    svg: { stroke: 'green' }
                }
            ]

            let startDate = moment(geigerData[0]['x']).format('YYYY년 MM월 DD일 HH:mm');
            let endDate = moment(geigerData[geigerData.length - 1]['x']).format('YYYY년 MM월 DD일 HH:mm');

            let middleIndex = geigerData.length / 2;

            const Decorator = ({ x, y, data }) => {
                return data[0]['data'].map((value, index) => {
                    let x1 = x(value.x);
                    let y1 = y(value.y);

                    if (value.y == min || value.y == max) {

                        return (
                            <G key={uuidv1()}>
                                <Circle
                                    key={uuidv1()}
                                    cx={x1}
                                    cy={y1}
                                    r={2}
                                    stroke={'green'}
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
                                    stroke={'green'}
                                    fill={'green'}
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

            const BubbleTooltip = ({ x, y, data}) => {
                let x1 = x(data[0]['data'][infoIndex].x);
                let y1 = y(data[0]['data'][infoIndex].y);
                let x2 = x1;
                let y2 = y1;
                let rect_x, rect_y;
                let rect_width = width / 5;
                let rect_height = width / 15;

                let lowestY = y(min) + 15;

                let textX, textY;

                let avgY = (y(min) + y(max)) / 2

                if (y1 > avgY) {
                    y2 -= 10;
                    rect_y = y2 - rect_height;

                    textY = (rect_y + y2) / 2 + 3;
                } else {
                    y2 += 10;
                    rect_y = y2;

                    textY = (rect_y * 2 + rect_height) / 2 + 3;
                }

                if (infoIndex > middleIndex) {
                    x2 -= 10;
                    rect_x = x2 - rect_width;

                    textX = (x2 + rect_x) / 2;
                } else {
                    x2 += 10;
                    rect_x = x2;

                    textX = (rect_x * 2 + rect_width) / 2;
                }

                return (
                    <G key={uuidv1()} {...this._panResponder.panHandlers} >
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
                            {`${data[0]['data'][infoIndex].y} μSv`}
                        </Text>
                        <Line
                            key={uuidv1()}
                            x1={`${x1}`}
                            x2={`${x1}`}
                            y1={`${y1}`}
                            y2={`${lowestY}`}
                            stroke='red'
                            strokeWidth='2'
                        />
                        <Circle
                            cx={x1}
                            cy={lowestY}
                            r={4}
                            stroke={'red'}
                            fill={'red'}
                        />
                    </G>
                );
            }

            return (
                <SafeAreaView style={styles.root}>
                    <View style={styles.container}>
                        <ScrollView
                            scrollEnabled={true}
                            indicatorStyle={'white'}
                            bouncesZoom={true}
                        >
                            <View style={styles.listViewButtonContainer}>
                                <ListViewButton changeListView={this.changeListViewMode} />
                                <TooltipButton changeTooltipMode={this.changeTooltipMode} />
                            </View>
                            <LabelText types='g' />
                            <Animated.View style={{ marginLeft: 10, flexDirection: 'row' }}>
                                <YAxis
                                    data={g}
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
                                    key={uuidv1()}
                                >
                                    <Grid />
                                    <Decorator />
                                    {isTooltipMode && <BubbleTooltip />}
                                </LineChart>
                            </Animated.View>
                            <DataText 
                                currentGeiger={geigerData[geigerData.length - 1]['y']}
                                types={'g'}
                                minGeiger={min}
                                maxGeiger={max}
                                startDate={startDate}
                                endDate={endDate}
                            />
                            {isListViewMode && geigerData.map(d => {
                                let valueStr = d['y'] + ' μSv'
                                let timeStr = moment(d['x']).format('HH:mm:ss');
                                return (<ListViewScreen valueStr={valueStr} timeStr={timeStr} key={uuidv1()} />)
                            })}
                        </ScrollView>
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
