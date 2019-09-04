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

export default class ListViewButton extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        changeListView: PropTypes.func.isRequired
    };

    render() {
        let { changeListView } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => changeListView()}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>List View</Text>
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
