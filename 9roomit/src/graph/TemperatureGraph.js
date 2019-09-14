import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated,
    Text,
    TouchableOpacity
} from 'react-native'
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from "moment";
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';
import { Circle, G } from 'react-native-svg'
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from 'react-native-modal-datetime-picker';

import DataText from './components/DataText'
import LoadingGraph from './components/LoadingGraph'
import LabelText from './components/LabelText'
import NoData from './components/NoData'
import ListViewButton from './components/ListViewButton'
import ListViewScreen from './components/ListViewScreen'
import RefreshButton from './components/RefreshButton'


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20, left: 20, right: 20 }

export default class TemperatureGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isListViewMode: false,
            isDatePicker1Visible: false,
            isDatePicker2Visible: false,
            startDate_picker: undefined,
            endDate_picker: undefined
        }

        this.changeListViewMode = this.changeListViewMode.bind(this);
        this.makeDatePickerVisible_start = this.makeDatePickerVisible_start.bind(this);
        this.hideDateTimePicker_start = this.hideDateTimePicker_start.bind(this);
        this.makeDatePickerVisible_end = this.makeDatePickerVisible_end.bind(this);
        this.hideDateTimePicker_end = this.hideDateTimePicker_end.bind(this);
        this.requestDataWithCustomDateRange = this.requestDataWithCustomDateRange.bind(this);
    }

    static propTypes = {
        temperatureData: PropTypes.array.isRequired,
        t: PropTypes.array.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        refresh: PropTypes.func.isRequired,
        pickerData: PropTypes.array.isRequired,
        changePickerData: PropTypes.func.isRequired,
        customPicker: PropTypes.bool.isRequired,
        fetchData: PropTypes.func.isRequired
    };

    makeDatePickerVisible_start = () => {
        this.setState({ isDatePicker1Visible: true });
    }

    hideDateTimePicker_start = () => {
        this.setState({ isDatePicker1Visible: false });
    }

    handleTimePicked_start = (datetime) => {
        this.setState({ startDate_picker: datetime });
    }

    makeDatePickerVisible_end = () => {
        this.setState({ isDatePicker2Visible: true });
    }

    hideDateTimePicker_end = () => {
        this.setState({ isDatePicker2Visible: false });
    }

    handleTimePicked_end = (datetime) => {
        this.setState({ endDate_picker: datetime });
    }

    requestDataWithCustomDateRange = () => {
        let { startDate_picker, endDate_picker } = this.state;

        const diffTime = Math.abs(endDate_picker.getTime() - startDate_picker.getTime());
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        this.props.fetchData(diffHours);
    }

    componentDidMount = () => {
        this._isLoaded();
    }

    changeListViewMode = () => {
        let { isListViewMode } = this.state;
        this.setState({ isListViewMode: !isListViewMode });
    }

    _isLoaded = () => {
        this.setState({ isLoaded: true });
    }


    render() {
        let { isLoaded, isListViewMode, isDatePicker1Visible, isDatePicker2Visible, startDate_picker, endDate_picker } = this.state;
        let { temperatureData, t, min, max, pickerData, changePickerData, customPicker } = this.props;

        if (!isLoaded) {
            return (
                <LoadingGraph />
            )
        }

        if (temperatureData.length == 0) {
            return (
                <NoData />
            )
        } else {
            let data = [
                {
                    data: temperatureData,
                    svg: { stroke: 'red' },
                }
            ]

            let min_grid = min;
            let max_grid = max;

            if (max - min < 4) {
                min_grid -= 2;
                max_grid += 2;
            }

            let startDate = moment(temperatureData[0]['x']).format('YYYY년 MM월 DD일 HH:mm');
            let endDate = moment(temperatureData[temperatureData.length - 1]['x']).format('YYYY년 MM월 DD일 HH:mm');

            const Decorator = ({ x, y, data }) => {
                return data[0]['data'].map((value, index) => {
                    if (x(value.x) && y(value.y)) {
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
                                        stroke={'red'}
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
                                        stroke={'red'}
                                        fill={'red'}
                                    />
                                </G>
                            )
                        }
                    }
                })
            }

            let year_s = ''
            let year_e = ''
            let month_s = ''
            let month_e = ''
            let date_s = ''
            let date_e = ''

            if (startDate_picker) {
                year_s = startDate_picker.getYear() + 1900;
                month_s = startDate_picker.getMonth() + 1;
                date_s = startDate_picker.getDate();
            }

            if (endDate_picker) {
                year_e = endDate_picker.getYear() + 1900;
                month_e = endDate_picker.getMonth() + 1;
                date_e = endDate_picker.getDate();
            }

            let timeStr_start = startDate_picker == undefined ? '시작' : `${year_s}/${month_s}/${date_s}`;
            let timeStr_end = endDate_picker == undefined ? '종료' : `${year_e}/${month_e}/${date_e}`;

            return (
                <Animated.View style={styles.container}>
                    <ScrollView
                        scrollEnabled={true}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.text}>조회기간 </Text>
                            <RadioGroup
                                radioButtons={pickerData}
                                onPress={changePickerData}
                                flexDirection='row'
                            ></RadioGroup>
                        </View>
                        {customPicker && <View style={styles.datePickerButtonContainer}>
                            <TouchableOpacity style={styles.datePickerButton} onPress={this.makeDatePickerVisible_start}>
                                <Text>{timeStr_start}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.datePickerButton} onPress={this.makeDatePickerVisible_end}>
                                <Text>{timeStr_end}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.datePickerButton} onPress={this.requestDataWithCustomDateRange}>
                                <Text>OK</Text>
                            </TouchableOpacity>
                        </View>}
                        <Animated.View style={{ marginLeft: 10, flexDirection: 'row' }}>
                            <YAxis
                                data={t}
                                style={{ width: width / 6 }}
                                contentInset={contentInset}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                min={min_grid}
                                max={max_grid}
                                scale={scale.scale}
                                //numberOfTicks={10}
                                formatLabel={(value) => value}
                            />
                            <LineChart
                                contentInset={contentInset}
                                style={{ height: height / 8 * 3, width: width / 3 * 2 }}
                                yAccessor={({ item }) => item.y}
                                xAccessor={({ item }) => item.x}
                                data={data}
                                gridMin={min_grid}
                                gridMax={max_grid}
                                animate={true}
                                key={uuidv1()}
                            >
                                <Grid />
                                {/* <Decorator /> */}
                            </LineChart>
                        </Animated.View>
                        <DataText
                            currentTemp={temperatureData[temperatureData.length - 1]['y']}
                            types={'t'}
                            minTemp={min}
                            maxTemp={max}
                            startDate={startDate}
                            endDate={endDate}
                        />
                        <View style={styles.listViewButtonContainer}>
                            {/* <ListViewButton changeListView={this.changeListViewMode} /> */}
                            <RefreshButton refresh={this.props.refresh} />
                        </View>
                        <DateTimePicker
                            isVisible={isDatePicker1Visible}
                            onConfirm={(res) => this.handleTimePicked_start(res)}
                            onCancel={() => this.hideDateTimePicker_start()}
                            datePickerModeAndroid='spinner'
                            mode='date' //TODO date? datetime? time?
                        />
                        <DateTimePicker
                            isVisible={isDatePicker2Visible}
                            onConfirm={(res) => this.handleTimePicked_end(res)}
                            onCancel={() => this.hideDateTimePicker_end()}
                            datePickerModeAndroid='spinner'
                            mode='date' //TODO date? datetime? time?
                        />
                        {isListViewMode && temperatureData.map(d => {
                            let valueStr = d['y'] + ' °C'
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
    },
    datePickerContainer: {
        flexDirection: 'row',
        marginTop: height / 18
    },
    text: {
        marginLeft: width / 20
    },
    datePickerButtonContainer: {
        flexDirection: 'row',
        marginVertical: width / 20,
        justifyContent: 'center'
    },
    datePickerButton: {
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: width / 30
    },
    datePickerButtonText: {
        color: 'black',
    }
});
