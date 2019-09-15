import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1'


const { width, height } = Dimensions.get('window');

export default class GraphButton extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        deviceNum: PropTypes.string.isRequired,
        onPressed: PropTypes.func.isRequired
    }

    changePage = () => {
        let { deviceNum, onPressed } = this.props;
        onPressed(deviceNum);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.linkButtonContainer}>
                    <TouchableOpacity
                        key={uuidv1()}
                        style={styles.itemButton}
                        activeOpacity={0.7}
                        onPress={this.changePage.bind(this)}>
                        <Text style={styles.linkText}>{'데이터 조회'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingTop: width / 30,
        paddingBottom: width / 25
    },
    linkButtonContainer: {
        flexDirection: 'row',
    },
    linkText: {
        color: '#1a3f95',
        fontSize: width / 22
    },
    itemButton: {
        width: width / 4,
        height: width / 13,
        backgroundColor: 'darkgrey', //'#a8a9ad',
        borderColor: 'darkgrey',
        borderWidth: 0.7,
        borderRadius: 13,
        alignItems: 'center'
    }
});