import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'

const { width } = Dimensions.get('window');

export default class LoadingGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.warningContainer}>
                <Text style={styles.warningText}>Data not enough to draw the graph</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    warningContainer: {
        flex: 1,
        alignItems: 'center'
    },
    warningText: {
        fontSize: width / 15,
        color: 'red'
    }
});
