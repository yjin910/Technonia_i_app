import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';


const { width, height } = Dimensions.get('window');

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };


    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            devices: []
        };
    }

    componentDidMount() {
        const email = this.props.navigation.getParam('email', '');
        this.fetchData(email);
    }

    fetchData = (email) => {
        //TODO url for device list ??
        const url = 'http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/main/:mainUuid?email=' + email;
        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let devices = [];

                    for (i = 0; i < result.length; i++) {
                        if (result[i]['deviceNum']) devices.push(result[i]['deviceNum']);
                    }

                    this.setState({
                        isLoaded: true,
                        devices: devices
                    });
                }
            )
            .catch((error) => {
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                //console.log(error);
                console.log('error!!')
                this.setState({
                    isLoaded: false
                });
            });
    }

    render() {
        let { isLoaded, devices } = this.state;
        //TODO 1) drawer 2) device list

        if (isLoaded) {
            return (
                <View style={styles.container}>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.notLoadedText}>Not loaded</Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notLoadedText: {
        fontSize: width / 25,
        color: 'red'
    }
});