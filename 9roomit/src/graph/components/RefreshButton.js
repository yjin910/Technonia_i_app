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
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: width / 40
    },
    buttonText: {
        fontSize: width / 25
    },
    button: {
        width: width / 5,
        height: width / 13,
        backgroundColor: '#a8a9ad',
        borderColor: '#1a3f95',
        borderWidth: 0.7,
        borderRadius: 13,
        alignItems: 'center',
        marginRight: width / 25,
    }
});
