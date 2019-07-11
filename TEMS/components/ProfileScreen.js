import React from 'react';
import {
    StyleSheet,
    Dimensions,
    StatusBar,
    ScrollView
} from 'react-native';
import uuidv1 from 'uuid/v1';

import DeviceCard from './DeviceCard';


const { width, height } = Dimensions.get('window');

export default class ProfileScreen extends React.Component {
    /* Make the navigation header invisible. */
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            //
        }
    }

    render() {
        let cards;

        return (
            <ScrollView
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                indicatorStyle={'white'}>
                <StatusBar barStyle="light-content" />
                {cards}
            </ScrollView>
        );
    }
}

/* stylesheet */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1a3f95',
    },
    registerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height / 3 * 2,
        backgroundColor: '#1a3f95',
    },
    registerMessage: {
        color: 'white',
        fontSize: width / 20
    },
    contactMessage: {
        color: 'white',
        fontSize: width / 20
    },
    noInstalledContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height / 3 * 2,
        backgroundColor: '#1a3f95',
    },
    noInstalledMessage: {
        color: 'white',
        fontSize: width / 20
    },
    loadingText: {
        color: '#ffffff',
        fontSize: width / 25,
        paddingLeft: 15,
    },
});
