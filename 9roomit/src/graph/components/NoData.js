import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'

const { width, height } = Dimensions.get('window');

export default class LoadingGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Data not enough</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    warningContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: height / 7
    },
    warningText: {
        fontSize: width / 15,
        color: 'red'
    }
});
