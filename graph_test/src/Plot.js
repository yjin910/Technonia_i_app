import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native'
import PropTypes from "prop-types";
import Plotly from 'react-native-plotly';

import LoadingGraph from './LoadingGraph'


const { width, height } = Dimensions.get('window');

export default class PlotScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data_t: [],
            data_h: [],
            times: [],
            yAxisData: [],
            minGrid: 0,
            maxGrid: 0,
            layout: {}
        }
    }

    static propTypes = {
        changeListView: PropTypes.func.isRequired
    };

    createLayout = (yMin, yMax, xAxis, yAxis) => {
        let layout = {
            title: 'data plot',
            xaxis: {
                range: [xAxis[0], xAxis[xAxis.length - 1]],
                showgrid: true //false
            },
            yaxis: {
                range: [yMin, yMax],
                showgrid: true //false
            },
            width: width / 5 * 4,
            height: height / 3 * 2
        }

        return layout;
    }

    setData = () => {
        let raw_data = [
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "t": "24.71" },
            { "s": "60", "time_val": "2019-08-09T23:05:39+09:00", "h": "55" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "t": "25.71" },
            { "s": "61", "time_val": "2019-08-09T23:10:39+09:00", "h": "60" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "t": "24.73" },
            { "s": "62", "time_val": "2019-08-09T23:15:39+09:00", "h": "58" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "t": "25.75" },
            { "s": "63", "time_val": "2019-08-09T23:20:39+09:00", "h": "57" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "t": "26.77" },
            { "s": "64", "time_val": "2019-08-09T23:25:39+09:00", "h": "53" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "t": "27.31" },
            { "s": "65", "time_val": "2019-08-09T23:30:39+09:00", "h": "55" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "t": "28.19" },
            { "s": "66", "time_val": "2019-08-09T23:35:39+09:00", "h": "60" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "t": "27.86" },
            { "s": "67", "time_val": "2019-08-09T23:40:39+09:00", "h": "63" }
        ]

        let data_t = [];
        let data_h = [];
        let times = [];
        let yAxisData = [];

        let min = 0;
        let max = 0;

        for (let i = 0; i < raw_data.length; i++) {
            let d = raw_data[i];
            let t = d['t'];
            let h = d['h'];
            let timeData = new Date(d['time_val']);

            if (t) {
                let temp = parseFloat(t)
                if (temp > max) max = temp;
                if (temp < min) min = temp;
                data_t.push({ x: timeData, y: temp });

                yAxisData.push(temp);
            }

            if (h) {
                let humi = parseFloat(h)
                if (humi > max) max = humi;
                if (humi < min) min = humi;
                data_h.push({ x: timeData, y: humi });

                yAxisData.push(humi);
            }

            if (!times.includes(timeData)) times.push(timeData);
        }

        let layout = this.createLayout(min, max, times, yAxisData);

        this.setState({ data_t: data_t, data_h: data_h, yAxisData: yAxisData, times: times, minGrid: min, maxGrid: max, layout: layout });
    }

    render() {
        let { data_t, data_h, layout } = this.state;

        if (data_t.length == 0 || data_h.length == 0) {
            this.setData();

            return (
                <LoadingGraph />
            );
        } else {
            let data = [data_t, data_h]
            return (
                <View style={styles.container}>
                    <Plotly
                        data={data}
                        layout={layout}
                        enableFullPlotly={true}
                    />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
