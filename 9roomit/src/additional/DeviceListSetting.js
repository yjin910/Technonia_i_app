import React from 'react';
import {
    AsyncStorage,
    ActivityIndicator,
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import uuidv1 from 'uuid/v1'
import Drawer from 'react-native-drawer'

import DrawerButton from '../graph/components/DrawerButton'
import Footer from '../Footer';
import I18n from '../i18n'


const { width, height } = Dimensions.get('window');
const MENU_IMAGE = require('../../assets/menu.png');
const BACK_IMAGE = require('../../assets/back.png');
const LOGO_IMAGE = require('../../assets/logo.png');

const menu = [
    { title: 'Main' },
    { title: 'Profile' },
    { title: 'Setting' },
    { title: 'Log out' },
    { title: 'Help' },
    { title: 'Copyright' },
]

export default class DeviceListSettingScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            deviceName: ''
        }

        this.navigateToGraphScreen = this.navigateToGraphScreen.bind(this);
        this.navigateToBLESettings = this.navigateToBLESettings.bind(this);
        this.navigateToHelpScreen = this.navigateToHelpScreen.bind(this);
        this.navigateToCopyrightScreen = this.navigateToCopyrightScreen.bind(this);
        this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
        this.navigateToProfileScreen = this.navigateToProfileScreen.bind(this);
        this.logOut_async = this.logOut_async.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    openDrawer() {
        this.drawer.open()
    }

    closeDrawer() {
        this.drawer.close()
    }

    navigateToBLESettings = () => {
        this.closeDrawer();
        console.log('navigate to ble setting screen');
        this.props.navigation.navigate('BLEManaer');
    }

    navigateToMainScreen = async () => {
        this.closeDrawer();
        let email = await AsyncStorage.getItem('9room@email');
        this.props.navigation.navigate('Main', { email: email });
    }

    navigateToHelpScreen = () => {
        this.closeDrawer();
        this.props.navigation.navigate('Help');
    }

    navigateToCopyrightScreen = () => {
        this.closeDrawer();
        this.props.navigation.navigate('Copyright');
    }

    navigateToGraphScreen = (deviceNum) => {
        this.props.navigation.navigate('Graph', { deviceNum: deviceNum });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    navigateToProfileScreen = async () => {
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
                    onPress = this.navigateToBLESettings;
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

    logOut_async = async () => {
        await AsyncStorage.removeItem('9room@email');
        await AsyncStorage.removeItem('9room@pw');
        await AsyncStorage.removeItem('9room@autoLogin');

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });

        this.props.navigation.dispatch(resetAction);
    }

    addDevice = async () => {
        let uuid = this.state.deviceName;
        let email = await AsyncStorage.getItem('9room@email');

        if (email) {
            console.log('successfully get email from async storage');
        } else {
            alert('error!');
            return;
        }

        let url = `http://groom.techtest.shop:8090/profile/userInfo?u=${uuid}&email=${email}`

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                uuid: uuid
            })
        })
        .then(res => {
            console.log(res);
            this.goBack();
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        });
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
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView>
                                <View style={styles.container}>
                                    <TextInput style={styles.inputBox}
                                        placeholder={I18n.t('deviceUUID')}
                                        placeholderTextColor="#ffffff"
                                        selectionColor="#1a3f95"
                                        keyboardType="email-address"
                                        onChangeText={(deviceName) => this.setState({ deviceName: deviceName })}
                                        value={this.state.deviceName}
                                    />
                                    <TouchableOpacity style={styles.buttonBox} onPress={() => this.addDevice()}>
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
        marginTop: height / 6
    },
    logoImage: {
        width: height / 6,
        height: height / 6,
        marginBottom: height / 10,
        marginTop: height / 20
    },
    inputBox: {
        width: width * 4 / 5,
        height: height / 14,
        backgroundColor: "#1a3f95",
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: width / 25,
        color: "white",
        marginVertical: width / 15
    },
    buttonBox: {
        width: width * 4 / 5,
        height: height / 14,
        backgroundColor: '#a8a9ad',
        borderRadius: 25,
        marginVertical: width / 15,
        paddingVertical: 5,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: width / 23,
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
