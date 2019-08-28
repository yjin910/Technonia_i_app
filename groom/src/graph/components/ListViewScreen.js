import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'
import PropTypes from "prop-types";


const { width, height } = Dimensions.get('window');

export default class ListViewScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: undefined
        }
    }

    static propTypes = {
        timeStr: PropTypes.string.isRequired,
        valueStr: PropTypes.string.isRequired
    };

    render() {
        let { timeStr, valueStr } = this.props;

        return (
            <View style={styles.dataList}>
                <View style={styles.timeTextContainer}>
                    <Text style={styles.timeText}>
                        {timeStr}
                    </Text>
                </View>
                <View style={styles.dataTextContainer}>
                    <Text style={styles.dataText}>
                        {valueStr}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dataList: {
        width: width,
        height: height / 10,
        borderBottomColor: "grey",
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        alignContent: 'space-around',
        marginLeft: width / 25,
        alignItems: 'center'
    },
    dataText: {
        fontSize: width / 20
    },
    timeText: {
        fontSize: width / 20
    },
    dataTextContainer: {
        flex: 1,
    },
    timeTextContainer: {
        flex: 1,
        marginRight: width / 30
    }
});
