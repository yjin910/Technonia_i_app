import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image
} from 'react-native'


const { width } = Dimensions.get('window');
const GROOM_ICON = require('../assets/groom.png');

const FOOTER_HEIGHT = width / 13;

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={GROOM_ICON}></Image>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>groom monitoring</Text>
                    <Text style={styles.versionText}>V0.91</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'dodgerblue',
        height: FOOTER_HEIGHT,
        flexDirection: 'row'
    },
    img: {
        width: FOOTER_HEIGHT,
        height: FOOTER_HEIGHT,
        marginRight: width / 30
    },
    text: {
        color: 'white'
    },
    versionText: {
        color: 'white'
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
