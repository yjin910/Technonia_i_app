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


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

export default class GeigerGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isListViewMode: false
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
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

    componentDidMount = () => {
        this._isLoaded();
    }

    _isLoaded = () => {
        this.setState({ isLoaded: true });
    }


    render() {
        let { isLoaded, isListViewMode } = this.state;
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

            return (
                <View style={styles.container}>
                    <ScrollView
                        scrollEnabled={true}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.listViewButtonContainer}>
                            <ListViewButton changeListView={this.changeListViewMode} />
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
    containerForGraphAndXAxis: {
        flex: 1,
        marginLeft: 10
    },
    listViewButtonContainer: {
        flex: 1 / 2
    }
});