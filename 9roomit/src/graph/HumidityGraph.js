import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';
import { Circle, G } from 'react-native-svg'

import DataText from './components/DataText'
import LoadingGraph from './components/LoadingGraph'
import LabelText from './components/LabelText'
import NoData from './components/NoData'
import ListViewButton from './components/ListViewButton'
import ListViewScreen from './components/ListViewScreen'
import RefreshButton from './components/RefreshButton'


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

export default class HumidityGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isListViewMode: false,
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
    }

    static propTypes = {
        humidityData: PropTypes.array.isRequired,
        h: PropTypes.array.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        refresh: PropTypes.func.isRequired
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

            let startDate = moment(humidityData[0]['x']).format('YYYY년 MM월 DD일 HH:mm');
            let endDate = moment(humidityData[humidityData.length - 1]['x']).format('YYYY년 MM월 DD일 HH:mm');


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
                                    stroke={'blue'}
                                    fill={'white'}
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
                                />
                            </G>
                        )
                    }
                })
            }

            return (
                <Animated.View style={styles.container}>
                    <ScrollView
                        scrollEnabled={true}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.listViewButtonContainer}>
                            <ListViewButton changeListView={this.changeListViewMode} />
                            <RefreshButton refresh={this.props.refresh} />
                        </View>
                        <LabelText types='h' />
                        <Animated.View style={{ marginLeft: 10, flexDirection: 'row' }}>
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
                                key={uuidv1()}
                            >
                                <Grid />
                                <Decorator />
                            </LineChart>
                        </Animated.View>
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
                </Animated.View>
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
    containerForGraphAndXAxis: {
        flex: 1,
        marginLeft: 10
    },
    listViewButtonContainer: {
        flex: 1 / 2,
        flexDirection: 'row'
    }
});
