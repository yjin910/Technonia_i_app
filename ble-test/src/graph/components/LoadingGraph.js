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
            <View style={styles.loadingContainer}>
                <Text>Please wait until the app receives the data</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center'
    },
    loadingText: {
        fontSize: width / 15,
    }
});
