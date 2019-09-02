import React from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native'


export default class GraphHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Text style={styles.headerTitle}>Graph</Text>)
    }
}

const styles = StyleSheet.create({
    headerTitle: {
        flex: 1.0,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white'
    }
});
