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
                <View style={styles.item} key={uuidv1()}>
                    <View style={styles.linkButtonContainer}>
                        <TouchableOpacity
                            key={uuidv1()}
                            style={styles.itemButton}
                            activeOpacity={0.7}
                            onPress={this.changePage.bind(this)}>
                            <Text style={styles.linkText}>{'graph'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingLeft: width / 3,
        paddingTop: width / 25
    },
    item: {
        flexDirection: 'row',
        paddingTop: height / 50,
        paddingLeft: width / 30,
        justifyContent: 'space-between'
    },
    itemID: {
        color: "#ffffff",
        fontSize: width / 20,
        marginRight: width / 30,
        textAlign: 'left'
    },
    linkButtonContainer: {
        flexDirection: 'row',
        marginRight: width / 20
    },
    linkText: {
        color: '#1a3f95',
        fontSize: width / 20
    },
    nameText: {
        color: 'white',
        fontSize: width / 20,
        paddingRight: width / 100
    },
    itemButton: {
        width: width / 6,
        height: width / 13,
        backgroundColor: 'darkgrey', //'#a8a9ad',
        borderColor: 'darkgrey',
        borderWidth: 0.7,
        borderRadius: 13,
        alignItems: 'center'
    }
});