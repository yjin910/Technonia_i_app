import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Platform,
    ScrollView,
    Image,
    AsyncStorage
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

export default class WiFiSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wifi: '',
            pw: '',
            uuid: ''
        }

        this.sendWiFiSettings = this.sendWiFiSettings.bind(this);
        this._successDisconnect = this._successDisconnect.bind(this);

        this.goBack = this.goBack.bind(this);
        this.goBack_Drawer = this.goBack_Drawer.bind(this);
        this.logOut_async = this.logOut_async.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);
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

    /**
     * Log if the BLE disconnection success
     */
    _successDisconnect = () => {
        console.log('disconnected!');
    }

    /**
     * Disconnects the BLE connection
     */
    disconnectDevice = async () => {
        const { uuid } = this.state;

        if (uuid == '') {
            uuid = await AsyncStorage.getItem('9room@device_uuid');
        }

        util.disconnectBLEDevice(uuid, this._successDisconnect);
    }

    goBack_Drawer = () => {
        this.closeDrawer();
        this.disconnectDevice();

        // pop 2 screens from the stack navigator to go back 2 screens
        this.props.navigation.pop(2);
    }

    logOut_async = async () => {
        this.closeDrawer();      //close drawer
        this.disconnectDevice(); //disconnect BLE connection

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
        this.closeDrawer();      //close drawer
        //TODO this.disconnectDevice(); //disconnect BLE connection

        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Main', { email: email });
    }

    navigateToHelpScreen = () => {
        this.closeDrawer();      //close drawer
        //TODO this.disconnectDevice(); //disconnect BLE connection

        this.props.navigation.navigate('Help');
    }

    navigateToCopyrightScreen = () => {
        this.closeDrawer();      //close drawer
        //TODO this.disconnectDevice(); //disconnect BLE connection

        this.props.navigation.navigate('Copyright');
    }

    navigateToProfileScreen = async () => {
        this.closeDrawer();      //close drawer
        //TODO this.disconnectDevice(); //disconnect BLE connection

        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Profile', { email: email });
    }

    goBack = () => {
        this.props.navigation.goBack();
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

    sendWiFiSettings = async () => {
        let { wifi, pw, uuid } = this.state;

        if (uuid == '') {
            uuid = await AsyncStorage.getItem('9room@device_uuid');
        }
        util.sendData_wifi(uuid, wifi, pw);
    }

    componentDidMount = () => {
        const uuid = this.props.navigation.getParam('uuid', '');
        this.setState({ uuid: uuid });
    }

    render() {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 0, android: width / 3 })}
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : null}
                enabled>
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
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView>
                                <View style={styles.container}>
                                    <TextInput style={styles.inputBox}
                                        placeholder="Wi-Fi"
                                        placeholderTextColor="#ffffff"
                                        selectionColor="#1a3f95"
                                        keyboardType="email-address"
                                        onChangeText={(wifi) => this.setState({ wifi: wifi })}
                                        value={this.state.wifi}
                                    />
                                    <TextInput style={styles.inputBox}
                                        placeholder="Password"
                                        placeholderTextColor="#ffffff"
                                        selectionColor="#1a3f95"
                                        onChangeText={(pw) => this.setState({ pw: pw })}
                                        value={this.state.pw}
                                    />
                                    <TouchableOpacity style={styles.buttonBox} onPress={() => this.sendWiFiSettings()}>
                                        <Text style={styles.buttonText}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                        <Footer />
                    </Drawer>
                </SafeAreaView>
            </KeyboardAvoidingView>
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
    keyboardAvoidingContainer: {
        flex: 1
    },
    root: {
        flex: 1
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height / 7
    },
    logoImage: {
        width: height / 6,
        height: height / 6,
        marginBottom: height / 10,
        marginTop: height / 20
    },
    inputBox: {
        width: width * 4 / 5,
        height: height / 15,
        backgroundColor: "#1a3f95",
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: width / 25,
        color: "white",
        marginVertical: width / 15
    },
    buttonBox: {
        width: width * 4 / 5,
        height: height / 15,
        backgroundColor: '#a8a9ad',
        borderRadius: 25,
        marginVertical: width / 15,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 25,
        fontWeight: '500',
        color: '#1a3f95',
        textAlign: 'center'
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
