import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions
} from 'react-native';


const { width, height } = Dimensions.get('window');

export default class WelcomeScreen extends React.Component {
    static navigationOptions = {
        title: 'TEMS',
        headerStyle: {
            backgroundColor: '#1a3f95',
        },
        headerTintColor: '#fff',
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    BackgroundColor="1a3f95"
                    barStyle="light-content"
                />
                <Image
                    resizeMode='contain'
                    resizeMethod='auto'
                    style={styles.welcomeScreenImage}
                    source={require('../assets/icon.png')}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a3f95',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcomeScreenImage: {
        width: width / 3,
        height: width / 3
    }
});