import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Image,
    TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

import I18n from './i18n';

const { width, height } = Dimensions.get("window");


export default class Device extends Component {
    constructor(props) {
        super(props);

        this.changePage = this.changePage.bind(this);
    }

    static propTypes = {
        deviceNum: PropTypes.string.isRequired,
        onPressed: PropTypes.func.isRequired,
        currentGeiger: PropTypes.number.isRequired,
        currentTemp: PropTypes.number.isRequired,
        currentHumi: PropTypes.number.isRequired,
        geigerIsNull: PropTypes.bool.isRequired,
        temperatureIsNull: PropTypes.bool.isRequired,
        humidityIsNull: PropTypes.bool.isRequired
    };

    changePage = () => {
        let { deviceNum, onPressed } = this.props;
        onPressed(deviceNum);
    }

    render() {
        let { deviceNum, currentGeiger, currentTemp, currentHumi, geigerIsNull, temperatureIsNull, humidityIsNull } = this.props;

        let geiger = geigerIsNull ? `${I18n.t('currentGeiger')} N/A` : `${I18n.t('currentGeiger')} ${currentGeiger} μSv`
        let temperature = temperatureIsNull ? `${I18n.t('currentTemp')} N/A` : `${I18n.t('currentTemp')} ${currentTemp} °C`
        let humidity = humidityIsNull ? `${I18n.t('currentHumi')} N/A` : `${I18n.t('currentHumi')} ${currentHumi} %`;

        return (
            <View style={styles.root}>
                <TouchableOpacity
                    style={styles.container}
                    onPress={this.changePage}
                >
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Device</Text>
                        <Text style={styles.deviceNumText}>{': ' + deviceNum}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.valueText}>{geiger}</Text>
                        <Text style={styles.valueText}>{temperature}</Text>
                        <Text style={styles.valueText}>{humidity}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: "white",
        width: width,
        height: height / 6,
        borderBottomColor: "darkgrey",
        borderBottomWidth: 0.5,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    deviceNumText: {
        fontSize: width / 20,
        color: 'darkslategrey'
    },
    itemContainer: {
        flex: 1,
        marginLeft: width / 4
    },
    labelContainer: {
        width: width / 4
    },
    labelText: {
        color: 'black',
        fontSize: width / 20
    },
    valueText: {
        color: 'darkslategrey',
        fontSize: width / 23
    }
});