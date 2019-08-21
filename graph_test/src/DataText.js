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
        types: PropTypes.string.isRequired,
        currentTemp: PropTypes.number,
        currentHumi: PropTypes.number,
        currentGeiger: PropTypes.number,
        maxTemp: PropTypes.number,
        minTemp: PropTypes.number,
        maxHumi: PropTypes.number,
        minHumi: PropTypes.number,
        maxGeiger: PropTypes.number,
        minGeiger: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string
    };

    render() {
        let { types, startDate, endDate } = this.props;

        switch (types) {
            case 't' :
                let { currentTemp, maxTemp, minTemp } = this.props;
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`시작: ${startDate}`}</Text>
                            <Text style={styles.text}>{`종료: ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`현재 온도: ${currentTemp} ºC`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`최고 온도: ${maxTemp} ºC`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`최저 온도: ${minTemp} ºC`}</Text>
                        </View>
                    </View>
                )
            case 'h' :
                let { currentHumi, maxHumi, minHumi } = this.props;
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`시작: ${startDate}`}</Text>
                            <Text style={styles.text}>{`종료: ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`현재 습도: ${currentHumi} %`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`최고 습도: ${maxHumi} %`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`최저 습도: ${minHumi} %`}</Text>
                        </View>
                    </View>
                )
            case 'g' :
                let { currentGeiger, minGeiger, maxGeiger } = this.props;
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`시작: ${startDate}`}</Text>
                            <Text style={styles.text}>{`종료: ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`현재 방사능 값: ${currentGeiger} mSv`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`방사능 최고값: ${maxGeiger} mSv`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`방사능 최저값: ${minGeiger} mSv`}</Text>
                        </View>
                    </View>
                )
            default:
                return (
                    <View style={styles.textContainer}></View>
                );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: width / 15,
        marginBottom: width / 15,
    },
    textContainer: {
        width: width,
        alignItems: 'flex-start',
        //marginTop: width / 6,
        //marginBottom: width / 20
    },
    dateTextContainer: {
        width: width,
        alignItems: 'flex-start',
        marginBottom: width / 30
    },
    text: {
        fontSize: width / 25,
        marginHorizontal: width / 5
    }
})