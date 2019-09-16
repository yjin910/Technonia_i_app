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

import GraphButton from "./GraphButton";


const { width, height } = Dimensions.get("window");

const IMG = require('../assets/ble_geiger_icon.png');

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
        let { deviceNum, onPressed, currentGeiger, currentTemp, currentHumi, geigerIsNull, temperatureIsNull, humidityIsNull } = this.props;

        let geiger = geigerIsNull ? `현재 방사능 : N/A` : `현재 방사능 : ${currentGeiger} μSv`
        let temperature = temperatureIsNull ? `현재 온도  : N/A` : `현재 온도  : ${currentTemp} °C`
        let humidity = humidityIsNull ? `현재 습도  : N/A` : `현재 습도  : ${currentHumi} %`;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.container}
                    onPress={this.changePage}
                >
                {/* <View style={styles.imgContainer}>
                    <Image source={IMG} style={styles.img} />
                </View> */}
                <View>
                    <Text style={styles.labelText}>Device</Text>
                    <Text style={styles.deviceNumText}>{': ' + deviceNum}</Text>
                </View>
                <View style={styles.itemContainer}>
                    {/* <GraphButton deviceNum={deviceNum} onPressed={onPressed}/> */}
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
    container: {
        backgroundColor: "white",
        width: width,
        height: height / 6,
        borderBottomColor: "darkgrey",
        borderBottomWidth: 0.5,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
    },
    imgContainer: {
        paddingTop: 10,
        width: height / 8,
        height: height / 8
    },
    img: {
        width: height / 8,
        height: height / 8,
        borderRadius: height / 16,
    },
    deviceNumText: {
        fontSize: width / 20,
        color: 'darkslategrey'
    },
    itemContainer: {
        flex: 1,
        marginLeft: width / 4
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