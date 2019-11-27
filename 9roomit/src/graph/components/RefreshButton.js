import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native'
import PropTypes from "prop-types";


const { width } = Dimensions.get('window');

export default class RefreshButton extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        refresh: PropTypes.func.isRequired
    };

    render() {
        let { refresh } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => refresh()}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>REFRESH</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: width / 40,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 25,
        color: 'white'
    },
    button: {
        width: width / 5 + 10,
        height: width / 13,
        backgroundColor: 'dodgerblue', //'#a8a9ad',
        borderColor: '#1a3f95',
        borderWidth: 0.7,
        borderRadius: 13,
        alignItems: 'center',
        marginRight: width / 25,
        justifyContent: 'center'
    }
});
