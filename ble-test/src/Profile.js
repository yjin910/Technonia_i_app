import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    ScrollView,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image
} from 'react-native';
import uuidv1 from 'uuid/v1'
import Drawer from 'react-native-drawer'

import Device from './Device'
import DrawerButton from './graph/components/DrawerButton'


const { width } = Dimensions.get('window');
const MENU_IMAGE = require('../assets/menu.png');

const menu = [
    { title: 'BLE Setting' },
]

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            devices: undefined
        };

        this.navigateToGraphScreen = this.navigateToGraphScreen.bind(this);
        this.navigateToBLESettings = this.navigateToBLESettings.bind(this);
    }

    componentDidMount() {
        const email = this.props.navigation.getParam('email', '');
        this.fetchData(email);
    }

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
    }

    renderDrawer = () => {
        const MENU_VIEW = menu.map((item, index) => {
            let title = item.title;
            let onPress;

            switch (title) {
                case 'BLE Setting':
                    onPress = this.navigateToBLESettings;
                    break;
                default:
                    console.log('Invalid title: ', title);
                    onPress = null;
            }

            return (<DrawerButton onPress={onPress} title={title} key={uuidv1()} />);
        })
        return (
            <SafeAreaView style={styles.drawerContainer}>
                <View style={styles.drawerContainer}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
    }

    fetchData = (email) => {
        //TODO url for device list ??
        const url = 'http://ec2-15-164-218-172.ap-northeast-2.compute.amazonaws.com:8090/main/:mainUuid?email=' + email;
        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
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

    navigateToBLESettings = () => {
        let {devices} = this.state;

        if (devices || devices.length == 0) {
            //TODO go to ble setting screen
            this.closeDrawer();
            console.log('navigate to ble setting screen');
            this.props.navigation.navigate('BLEManaer', { devices: devices })
        } else {
            alert('No devices detected');
            this.closeDrawer();
        }
    }

    navigateToGraphScreen = (type, deviceNum) => {
        switch (type) {
            case 'g' :
                this.props.navigation.navigate('Geiger', { deviceNum: deviceNum })
                break;
            case 'th' :
                this.props.navigation.navigate('TempHumiGraph', { deviceNum: deviceNum })
                break;
        }
    }

    render() {
        let { isLoaded, devices } = this.state;
        //TODO 1) drawer 2) device list

        if (isLoaded) {
            let Devices = devices.map(d => {
                return (
                    <Device key={uuidv1()} onPressed={this.navigateToGraphScreen} deviceNum={d} />
                )
            });

            return (
                <ScrollView
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    indicatorStyle={'white'}>
                    <StatusBar barStyle="light-content" />
                    <Drawer
                        ref={(ref) => this.drawer = ref}
                        content={this.renderDrawer()}
                        type='static'
                        tapToClose={true}
                        openDrawerOffset={0.35}
                        styles={drawerStyles}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 10, height: width / 10 }}>
                                    <Image style={{ tintColor: 'white', width: width / 10, height: width / 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.headerTitle}>Profile</Text>
                            <View style={styles.menuButton} />
                        </View>
                        <View style={styles.devicesContainer}>
                            {Devices}
                        </View>
                    </Drawer>
                </ScrollView>
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

const drawerStyles = {
    drawer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    main: {
        flex: 1.0,
        backgroundColor: 'white'
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'center'
    },
    notLoadedText: {
        fontSize: width / 25,
        color: 'red'
    },
    devicesContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    headerContainer: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#3B5998',
    },
    headerTitle: {
        flex: 1.0,
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white'
    },
    menuButton: {
        marginLeft: 8,
        marginRight: 8,
        alignSelf: 'center',
        tintColor: 'lightgrey'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: 'dodgerblue',//"#1a3f95",  //midnightblue,skyblue, slateblue
        justifyContent: 'flex-start'
    }
});