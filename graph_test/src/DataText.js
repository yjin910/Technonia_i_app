import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'
import PropTypes from "prop-types";

const { width } = Dimensions.get('window');

export default class DataText extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        currentTemp: PropTypes.number,
        currentHumi: PropTypes.number
    };

    render() {
        let { currentTemp, currentHumi } = this.props;
        return (
            <View style={styles.textContainer}>
                <Text style={styles.text}>{`현재 온도: ${currentTemp} ºC`}</Text>
                <Text style={styles.text}>{`현재 습도: ${currentHumi} %`}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textContainer: {
        width: width,
        alignItems: 'flex-start',
        marginTop: width / 6,
        marginBottom: width / 20
    },
    text: {
        fontSize: width / 25,
        marginHorizontal: width / 4
    }
})