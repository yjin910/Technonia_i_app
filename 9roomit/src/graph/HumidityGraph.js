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
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from 'react-native-modal-datetime-picker';

import DataText from './components/DataText'
import LoadingGraph from './components/LoadingGraph'
import ListViewButton from './components/ListViewButton'
import ListViewScreen from './components/ListViewScreen'
import RefreshButton from './components/RefreshButton'
import I18n from '../i18n'


const { width, height } = Dimensions.get('window');
const contentInset = { top: 20, bottom: 20 }

export default class HumidityGraph extends React.Component {
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
        this.refreshTab = this.refreshTab.bind(this);
        this.changePickerData_tabH = this.changePickerData_tabH.bind(this);
    }

    static propTypes = {
        humidityData: PropTypes.array.isRequired,
        h: PropTypes.array.isRequired,
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
     * Refresh the screen, and navigate the tab navigator ot the humidity tab.
     */
    refreshTab = () => {
        let { refresh } = this.props;
        refresh('H');
    }

    /**
     * Change the date picker data.
     * Let the app know that the current tab is 'H', which is the Humidity tab.
     *
     * @param data The date picker data.
     */
    changePickerData_tabH = (data) => {
        let { changePickerData } = this.props;
        changePickerData(data, 'H');
    }


    render() {
        let { isLoaded, isListViewMode, isDatePicker1Visible, isDatePicker2Visible, startDate_picker, endDate_picker } = this.state;
        let { humidityData, h, min, max, pickerData, customPicker } = this.props;

        if (!isLoaded) {
            return (<LoadingGraph />);
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

        if (humidityData == null || humidityData.includes(null) || humidityData.length == 0) {
            let dummyData = [{ x: 1, y: 52 }, { x: 2, y: 54 }, { x: 3, y: 56 }, { x: 4, y: 58 }, { x: 5, y: 60 }];
            let dummyYData = [52, 54, 56, 58, 60];

            return (
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.text}>{I18n.t('period')}</Text>
                        <RadioGroup
                            radioButtons={pickerData}
                            onPress={this.changePickerData_tabH}
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
                    <View style={{ marginLeft: 10, width: width - 10, height: height / 8 * 3, flexDirection: 'row' }}>
                        <YAxis
                            data={dummyYData}
                            style={{ width: width / 6 }}
                            contentInset={contentInset}
                            svg={{
                                fill: 'grey',
                                fontSize: 10,
                            }}
                            min={50}
                            max={65}
                            scale={scale.scale}
                            formatLabel={(value) => value}
                        />
                        <LineChart
                            contentInset={contentInset}
                            style={{ height: height / 8 * 3, width: width / 3 * 2 }}
                            yAccessor={({ item }) => item.y}
                            xAccessor={({ item }) => item.x}
                            data={dummyData}
                            gridMin={50}
                            gridMax={65}
                            animate={true}
                            key={uuidv1()}
                        >
                            <Grid />
                        </LineChart>
                    </View>
                    <View style={styles.emptyListViewButtonContainer}>
                        {/* <ListViewButton changeListView={this.changeListViewMode} /> */}
                        <RefreshButton refresh={this.refreshTab} />
                    </View>
                </View>
            );
        } else {
            let data = [
                {
                    data: humidityData,
                    svg: { stroke: 'blue' },
                }
            ]

            let startDate = moment(humidityData[0]['x']).format(I18n.t('dateFormatStr'));
            let endDate = moment(humidityData[humidityData.length - 1]['x']).format(I18n.t('dateFormatStr'));


            let min_grid = min;
            let max_grid = max;

            if (max - min < 5) {
                max_grid += 4;
                min_grid -= 4;
            } else if (max - min < 7) {
                max_grid += 3;
                min_grid -= 3;
            } else {
                max_grid += 2;
                min_grid -= 2;
            }


            return (
                <Animated.View style={styles.container}>
                    <ScrollView
                        scrollEnabled={true}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.text}>{I18n.t('period')}</Text>
                            <RadioGroup
                                radioButtons={pickerData}
                                onPress={this.changePickerData_tabH}
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
                        <View style={{ marginLeft: 10, width: width - 10, height: height / 8 * 3, flexDirection: 'row' }}>
                            <YAxis
                                data={h}
                                style={{ width: width / 6 }}
                                //style={{flex: 1}}
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
                                //style={{flex: 1}}
                                yAccessor={({ item }) => item.y}
                                xAccessor={({ item }) => item.x}
                                data={data}
                                gridMin={min_grid}
                                gridMax={max_grid}
                                animate={true}
                                key={uuidv1()}
                            >
                                <Grid />
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
                        <View style={styles.listViewButtonContainer}>
                            {/* <ListViewButton changeListView={this.changeListViewMode} /> */}
                            <RefreshButton refresh={this.refreshTab} />
                        </View>
                        {/* <DateTimePicker
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
                        /> */}
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
        flexDirection: 'row',
        marginBottom: width / 20
    },
    emptyListViewButtonContainer: {
        flex: 1 / 2,
        flexDirection: 'row',
        marginBottom: width / 20,
        marginTop: width / 5
    },
    datePickerContainer: {
        flexDirection: 'row',
        marginTop: height / 18,
        justifyContent: 'center',
        alignItems: 'center'
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
