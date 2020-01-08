import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    Image,
    SafeAreaView
} from 'react-native';
import Drawer from 'react-native-drawer'
import uuidv1 from 'uuid/v1';
import { StackActions, NavigationActions } from 'react-navigation';

import DrawerButton from '../graph/components/DrawerButton'
import Footer from '../Footer';

let util = require('./BLEUtil');

const { width, height } = Dimensions.get('window');

const LOGO_IMAGE = require('../../assets/logo.png');
const BACK_IMAGE = require('../../assets/back.png');
const MENU_IMAGE = require('../../assets/menu.png');

const menu = [
    { title: 'Main' },
    { title: 'Profile' },
    { title: 'Setting' },
    { title: 'Log out' },
    { title: 'Help' },
    { title: 'Copyright' },
]

export default class BLEMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uuid: '',
            isConnected: false
        }

        this.navigateToGeigerScreen = this.navigateToGeigerScreen.bind(this);
        this.navigateToWiFiScreen = this.navigateToWiFiScreen.bind(this);
        this.setConnectedDevice = this.setConnectedDevice.bind(this);
        this.handleConnectionError = this.handleConnectionError.bind(this);
        this.goBack = this.goBack.bind(this);

        this.goBack_Drawer = this.goBack_Drawer.bind(this);
        this.logOut_async = this.logOut_async.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);

        this._successDisconnect = this._successDisconnect.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
    }

    goBack_Drawer = () => {
        this.closeDrawer();
        this.goBack();
    }

    logOut_async = async () => {
        this.disconnectDevice();

        await AsyncStorage.removeItem('9room@email');
        await AsyncStorage.removeItem('9room@pw');
        await AsyncStorage.removeItem('9room@autoLogin');

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });

        this.props.navigation.dispatch(resetAction);
    }

    navigateToMainScreen = async () => {
        this.disconnectDevice();

        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Main', { email: email });
    }

    navigateToHelpScreen = () => {
        this.disconnectDevice();

        this.closeDrawer();
        this.props.navigation.navigate('Help');
    }

    navigateToCopyrightScreen = () => {
        this.disconnectDevice();

        this.closeDrawer();
        this.props.navigation.navigate('Copyright');
    }

    navigateToProfileScreen = async () => {
        this.disconnectDevice();

        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Profile', { email: email });
    }

    renderDrawer = () => {
        const MENU_VIEW = menu.map((item, index) => {
            let title = item.title;
            let onPress;

            switch (title) {
                case 'Setting':
                    onPress = this.goBack_Drawer;
                    break;
                case 'Log out':
                    onPress = this.logOut_async;
                    break;
                case 'Main':
                    onPress = this.navigateToMainScreen;
                    break;
                case 'Profile':
                    onPress = this.navigateToProfileScreen;
                    break;
                case 'Help':
                    onPress = this.navigateToHelpScreen;
                    break;
                case 'Copyright':
                    onPress = this.navigateToCopyrightScreen;
                    break;
                default:
                    console.log('Invalid title: ', title);
                    onPress = null;
            }

            return (<DrawerButton onPress={onPress} title={title} key={uuidv1()} />);
        });

        return (
            <SafeAreaView style={styles.drawerContainer}>
                <View style={styles.drawerContainer}>
                    {MENU_VIEW}
                </View>
            </SafeAreaView>
        );
    }

    componentDidMount = () => {
        let uuid = this.props.navigation.getParam('uuid', '');
        this.setState({uuid: uuid});
        this.connectDevice();
    }

    getDeviceNumber = async () => {
        await AsyncStorage.getItem('9room@device_uuid', (err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({ uuid: res });
            }
        });
    }

    handleConnectionError = (err) => {
        console.log(err);
    }

    setConnectedDevice = (uuid) => {
        this.setState({ device: uuid, isConnected: true });
    }

    connectDevice = async () => {
        let { uuid } = this.state;

        if (uuid == '') {
            await this.getDeviceNumber();
            uuid = this.state.uuid;
        }

        util.connectBLEDevice(uuid, this.setConnectedDevice, this.handleConnectionError);
    }

    _successDisconnect = () => {
        this.setState({ uuid: '', isConnected: false });
    }

    disconnectDevice = async () => {
        const { uuid } = this.state;
        if (uuid == '')
            uuid = this.props.navigation.getParam('uuid', '');

        if (uuid == '') uuid = await AsyncStorage.getItem('9room@device_uuid');

        util.disconnectBLEDevice(uuid, this._successDisconnect);
    }

    goBack = () => {
        this.disconnectDevice();
        this.props.navigation.goBack();
    }

    navigateToWiFiScreen = async () => {
        const { uuid } = this.state;
        if (uuid == '') uuid = await AsyncStorage.getItem('9room@device_uuid');
        this.props.navigation.navigate('WiFiSetting', { uuid: uuid });
    }

    navigateToGeigerScreen = async () => {
        const { uuid } = this.state;
        if (uuid == '') uuid = await AsyncStorage.getItem('9room@device_uuid');
        this.props.navigation.navigate('GeigerNameSetting', { uuid: uuid });
    }

    render() {
        let { isConnected } = this.state;

        if (isConnected) {
            return (
                <SafeAreaView style={styles.root}>
                    <Drawer
                        ref={(ref) => this.drawer = ref}
                        content={this.renderDrawer()}
                        type='overlay'
                        tapToClose={true}
                        openDrawerOffset={0.6}
                        styles={drawerStyles}
                        side={'right'}
                    >
                        <View style={styles.headerContainer}>
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.goBack()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={BACK_IMAGE} />
                                </TouchableOpacity>
                            </View>
                            <Image style={{ width: width / 3, height: height / 12 - 15 }} source={LOGO_IMAGE} />
                            <View style={styles.menuButton}>
                                <TouchableOpacity
                                    onPress={() => this.openDrawer()}
                                    style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => this.navigateToWiFiScreen()} style={styles.button}>
                                <Text style={styles.buttonText}>WiFi Setting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.navigateToGeigerScreen()} style={styles.button}>
                                <Text style={styles.buttonText}>Device Setting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.goBack()} style={styles.button}>
                                <Text style={styles.buttonText}>Other device</Text>
                            </TouchableOpacity>
                        </View>
                        <Footer />
                    </Drawer>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.root}>
                <Drawer
                    ref={(ref) => this.drawer = ref}
                    content={this.renderDrawer()}
                    type='overlay'
                    tapToClose={true}
                    openDrawerOffset={0.6}
                    styles={drawerStyles}
                    side={'right'}
                >
                    <View style={styles.headerContainer}>
                        <View style={styles.menuButton}>
                            <TouchableOpacity
                                onPress={() => this.goBack()}
                                style={{ tintColor: 'white', width: width / 9, height: width / 9, marginRight: width / 30, justifyContent: 'center' }}>
                                <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={BACK_IMAGE} />
                            </TouchableOpacity>
                        </View>
                        <Image style={{ width: width / 3, height: height / 12 - 15 }} source={LOGO_IMAGE} />
                        <View style={styles.menuButton}>
                            <TouchableOpacity
                                onPress={() => this.openDrawer()}
                                style={{ tintColor: 'white', width: width / 9, height: width / 9, justifyContent: 'center' }}>
                                <Image style={{ tintColor: 'white', width: width / 9 - 10, height: width / 9 - 10 }} source={MENU_IMAGE} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.notConnectedText}>Device not connected..</Text>
                        </View>
                    </View>
                    <Footer />
                </Drawer>
            </SafeAreaView>
        )
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
    root: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: width / 5 * 4,
        height: height / 15,
        backgroundColor: '#a8a9ad',
        borderRadius: 25,
        paddingVertical: width / 20,
        marginVertical: width / 15,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: "#1a3f95",
        textAlign: 'center'
    },
    notConnectedText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: '#1a3f95',
        textAlign: 'center',
        paddingVertical: width / 10
    },
    headerContainer: {
        height: height / 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3B5998',
    },
    menuButton: {
        marginLeft: 8,
        marginRight: 8,
        alignSelf: 'center',
        tintColor: 'white'
    },
    menuContainer: {
        flex: 1.0,
        backgroundColor: '#3B5998',
    },
    drawerContainer: {
        flex: 1,
    },
});
