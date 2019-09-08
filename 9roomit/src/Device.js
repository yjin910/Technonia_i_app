import React, { Component } from "react";
import { StyleSheet, View, Image, Dimensions, Text } from "react-native";
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
        onPressed: PropTypes.func.isRequired
    };

    render() {
        let { deviceNum, onPressed } = this.props;
        return (
            <View style={styles.container}>
                {/* <View style={styles.imgContainer}>
                    <Image source={IMG} style={styles.img} />
                </View> */}
                <Text style={styles.deviceNumText}>{deviceNum}</Text>
                <GraphButton deviceNum={deviceNum} onPressed={onPressed}/>
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
    }
});