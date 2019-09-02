import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Animated,
    StatusBar,
    PanResponder,
    TouchableOpacity,
    Image
} from 'react-native'
import { LineChart, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import uuidv1 from 'uuid/v1';
import Drawer from 'react-native-drawer'
import { Circle, Text, G, Rect, Line } from 'react-native-svg'

import DataText from './components/DataText'
import LoadingGraph from './components/LoadingGraph'
import LabelText from './components/LabelText'
import NoData from './components/NoData'
import ListViewScreen from './components/ListViewScreen'
import DrawerButton from './components/DrawerButton'
import GraphHeader from './components/GraphHeader'


const MENU_IMAGE = require('../../assets/menu.png');
const INTERVAL_TIME = 300000;

const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

const menu = [
    { title: 'ListView' },
    { title: 'Tooltip' },
]

export default class GeigerGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            infoIndex: 0,
            geigerData: undefined,
            g: [],
            min: 0,
            max: 0,
            isListViewMode: false,
            isTooltipMode: false
        }

        this.changeInfoIndex = this.changeInfoIndex.bind(this);
        this.fetchData_Async = this.fetchData_Async.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.changeListViewMode = this.changeListViewMode.bind(this);
        this.changeTooltipMode = this.changeTooltipMode.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        let deviceNum = 'u518'; //TODO
        this.fetchData_Async(deviceNum)

        this.setInterval();
    }

    componentWillUnmount = () => {
        this.removeInterval();
    }

    setInterval = () => {
        let deviceNum = 'u518';

        this._timer = setInterval(() => {
            console.log('fetch data start');
            this.fetchData_Async(deviceNum);
        }, INTERVAL_TIME);
    }

    removeInterval = () => {
        clearInterval(this._timer);
    }

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
    }

    changeListViewMode = () => {
        let { isListViewMode } = this.state;
        this.setState({ isListViewMode: !isListViewMode });
        this.closeDrawer();
    }

    changeTooltipMode = () => {
        let { isTooltipMode } = this.state;
        this.setState({ isTooltipMode: !isTooltipMode });
        this.closeDrawer();
    }

    renderDrawer = () => {
        const MENU_VIEW = menu.map((item, index) => {
            let title = item.title;
            let onPress;

            switch (title) {
                case 'Tooltip':
                    onPress = this.changeTooltipMode;
                    break;
                case 'ListView':
                    onPress = this.changeListViewMode;
                    break;
                default:
                    console.log('Invalid title: ', title);
                    onPress = null;
            }

            return (<DrawerButton onPress={onPress} title={title} key={uuidv1()}/>);
        })
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
    }

    fetchData_Async = async (deviceNum) => {
        const url = `http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/getdata?u=${deviceNum}&c=g`;
        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let num = result.length;
                    let data_g = [];
                    let gs = [];

                    let min_g, max_g;

                    let isNotFirst_g = false;

                    for (let i = 0; i < num; i++) {
                        let d = result[i];
                        let type = d['type'];
                        let time_val = new Date(d['time']);

                        if (type == 'g') {
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
                        }
                    }

                    this.setState({
                        geigerData: data_g,
                        g: gs,
                        min: min_g,
                        max: max_g,
                        isLoaded: true
                    });
                }
            )
            .catch((error) => {
                console.log(error);
            });
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
                let dataLength = this.state.geigerData.length;
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

    changeInfoIndex = (index) => {
        this.setState({ infoIndex: index });
    }

    render() {
        let { geigerData, g, min, max, isLoaded, infoIndex, isListViewMode, isTooltipMode } = this.state;

        if (!isLoaded || geigerData == undefined) {
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

            const BubbleTooltip = ({ x, y, data }) => {
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
                        <StatusBar barStyle="light-content" />
                        <Drawer
                            ref={(ref) => this.drawer = ref}
                            content={this.renderDrawer()}
                            type='static'
                            tapToClose={true}
                            openDrawerOffset={0.35}
                            styles={drawerStyles}
                        >
                            <View style={styles.headerContainer}>
                                <View style={styles.menuButton}>
                                    <TouchableOpacity
                                        onPress={() => this.openDrawer()}
                                        style={{ tintColor: 'white', width: width / 10, height: width / 10 }}>
                                        <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={MENU_IMAGE} />
                                    </TouchableOpacity>
                                </View>
                                <GraphHeader/>
                                <View style={styles.menuButton} />
                            </View>
                            <ScrollView
                                scrollEnabled={true}
                                indicatorStyle={'white'}
                                bouncesZoom={true}
                            >
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
                        </Drawer>
                    </View>
                </SafeAreaView>
            )
        }
    }
}


const drawerStyles = {
    drawer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    main: {
        flex: 1.0,
        backgroundColor: 'white'
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    containerForGraphAndXAxis: {
        flex: 1,
        marginLeft: 10
    },
    listViewButtonContainer: {
        flex: 1 / 2
    },
    mainContainer: {
        flex: 1.0,
        backgroundColor: 'white'
    },
    headerContainer: {
        height: height / 10,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#3B5998',
    },
    headerTitle: {
        flex: 1.0,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: width / 25
    },
    menuButton: {
        marginLeft: width / 40,
        marginRight: width / 40,
        alignSelf: 'center',
        tintColor: 'white'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
});
