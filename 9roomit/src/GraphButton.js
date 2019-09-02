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
const GEIGER_GRAPH_BUTTON_TEXT = '방사능'
const TEMP_HUMI_BUTTON_TEXT = '온습도'

export default class GraphButton extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        deviceNum: PropTypes.string.isRequired,
        onPressed: PropTypes.func.isRequired
    }

    changePage = (type) => {
        let { deviceNum, onPressed } = this.props;
        onPressed(type, deviceNum);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.item} key={uuidv1()}>
                    <View style={styles.linkButtonContainer}>
                        <Text style={styles.nameText}>{GEIGER_GRAPH_BUTTON_TEXT}</Text>
                        <TouchableOpacity
                            key={uuidv1()}
                            style={styles.itemButton}
                            activeOpacity={0.7}
                            onPress={this.changePage.bind(this, 'g')}>
                            <Text style={styles.linkText}>{'g'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.item} key={uuidv1()}>
                    <View style={styles.linkButtonContainer}>
                        <Text style={styles.nameText}>{TEMP_HUMI_BUTTON_TEXT}</Text>
                        <TouchableOpacity
                            key={uuidv1()}
                            style={styles.itemButton}
                            activeOpacity={0.7}
                            onPress={this.changePage.bind(this, 'th')}>
                            <Text style={styles.linkText}>{'th'}</Text>
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
        color: "darkslategrey",
        fontSize: width / 20
    },
    nameText: {
        color: 'white',
        fontSize: width / 20,
        paddingRight: width / 100
    },
    itemButton: {
        width: width / 7,
        height: width / 13,
        backgroundColor: 'darkgrey', //'#a8a9ad',
        borderColor: 'darkgrey',
        borderWidth: 0.7,
        borderRadius: 13,
        alignItems: 'center'
    }
});