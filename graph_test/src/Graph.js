import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Text
} from 'react-native'
import Drawer from 'react-native-drawer'
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import uuidv1 from 'uuid/v1';

import TemperatureGraph from './TemperatureGraph'
import HumidityGraph from './HumidityGraph'
import GeigerGraph from './GeigerGraph'
import TempHumiGraph from './TempHumiGraph'


const INTERVAL_TIME = 300000;
const MENU_IMAGE = require('../assets/menu.png');
const { width } = Dimensions.get('window');

const menu = [
    { title: 'ListView' },
    { title: 'Tooltip' },
]

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
            isLoaded: false,
            isTooltipMode: false,
            isListViewMode: false
        }

        this.openDrawer = this.openDrawer.bind(this);
        this.changeListViewMode = this.changeListViewMode.bind(this);
        this.changeTooltipMode = this.changeTooltipMode.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        let deviceNum = 'u518';
        this.fetchData_Async(deviceNum)

        this.setInterval();
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

    renderDrawer = () => {
        const MENU_VIEW = menu.map((item, index) => {
            let title = item.title;
            let onPress;
            
            switch(title) {
                case 'Tooltip' :
                    onPress = this.changeTooltipMode;
                    break;
                case 'ListView' :
                    onPress = this.changeListViewMode;
                    break;
                default:
                    console.log('Invalid title: ', title);
                    onPress = null;
            }

            return (
                <TouchableOpacity onPress={onPress} style={styles.menuTitleContainer} key={uuidv1()}>
                    <Text style={styles.menuTitle} key={index}>{item.title}</Text>
                </TouchableOpacity>
            );
        })
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {MENU_VIEW}
            </View>
        </SafeAreaView>
        );
    }

    componentWillUnmount = () => {
        this.clearInterval();
    }

    changeListViewMode = () => {
        let {isListViewMode} = this.state;
        this.setState({isListViewMode: !isListViewMode});
        this.closeDrawer();
    }

    changeTooltipMode = () => {
        let { isTooltipMode } = this.state;
        this.setState({ isTooltipMode: !isTooltipMode });
        this.closeDrawer();
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
        let { data_t, data_h, data_g, ts, hs, gs, min_t, min_h, min_g, max_t, max_h, max_g, isLoaded, isTooltipMode, isListViewMode } = this.state;

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
                isTooltipMode={props.screenProps.isTooltipMode}
                isListViewMode={props.screenProps.isListViewMode}
            />);
            const TempHumi = (props) => (<TempHumiGraph
                humidityData={props.screenProps.humidityData}
                temperatureData={props.screenProps.temperatureData}
                t={props.screenProps.ts}
                h={props.screenProps.hs}
                min_h={props.screenProps.min_h}
                max_h={props.screenProps.max_h}
                min_t={props.screenProps.min_t}
                max_t={props.screenProps.max_t}
                isTooltipMode={props.screenProps.isTooltipMode}
                isListViewMode={props.screenProps.isListViewMode}
            />);

            const AppNavigator = createMaterialTopTabNavigator({
                Geiger,
                TempHumi
            });

            const GraphApp = createAppContainer(AppNavigator);

            return (
                <SafeAreaView style={styles.root}>
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
                            <Text style={styles.headerTitle}>Graph</Text>
                            <View style={styles.menuButton} />
                        </View>
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
                            isListViewMode: isListViewMode,
                            isTooltipMode: isTooltipMode
                        }} />
                    </Drawer>
                </SafeAreaView>
            )
        } else {
            return (
                <View style={styles.root}></View>
            );
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
    mainContainer: {
        flex: 1.0,
        backgroundColor: 'white'
    },
    safeAreaStyle: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    headerContainer: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#3B5998',
    },
    headerTitle: {
        flex: 1.0,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white'
    },
    menuButton: {
        marginLeft: 8,
        marginRight: 8,
        alignSelf: 'center',
        tintColor: 'white'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    menuTitleContainer: {
        alignItems: 'center',
        height: 60,
        width: '100%',
        flexDirection: 'row',
        borderColor: 'red',
        borderWidth: 1 
    },
    menuTitle: {
        width: '100%',
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
    },
});
