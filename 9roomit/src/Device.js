import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    Image
} from "react-native";
import PropTypes from "prop-types";

import GraphButton from "./GraphButton";


const { width, height } = Dimensions.get("window");

const IMG = require('../assets/ble_geiger_icon.png');

export default class Device extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        deviceNum: PropTypes.string.isRequired,
        onPressed: PropTypes.func.isRequired,
        currentGeiger: PropTypes.number.isRequired,
        currentTemp: PropTypes.number.isRequired,
        currentHumi: PropTypes.number.isRequired
    };

    render() {
        let { deviceNum, onPressed, currentGeiger, currentTemp, currentHumi } = this.props;
        return (
            <View style={styles.container}>
                {/* <View style={styles.imgContainer}>
                    <Image source={IMG} style={styles.img} />
                </View> */}
                <View>
                    <Text style={styles.labelText}>Device</Text>
                    <Text style={styles.deviceNumText}>{': ' + deviceNum}</Text>
                </View>
                <View style={styles.itemContainer}>
                    <GraphButton deviceNum={deviceNum} onPressed={onPressed}/>
                    <Text style={styles.valueText}>{`현재 방사능 : ${currentGeiger} μSv`}</Text>
                    <Text style={styles.valueText}>{`현재 온도  : ${currentTemp} °C`}</Text>
                    <Text style={styles.valueText}>{`현재 습도  : ${currentHumi} %`}</Text>
                </View>
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
        fontSize: width / 22
    }
});