import React from 'react'
import {
    StyleSheet,
    PermissionsAndroid,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    RefreshControl
} from 'react-native';
import wifi from 'react-native-android-wifi';


export default class AndroidWiFiScanningScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wifiArray: [],
            refreshing: false
        }

        this.getList = this.getList.bind(this);
        this.rescanWiFiList = this.rescanWiFiList.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    getList = () => {
        /*
         * wifiStringList is a stringified JSONArray with the following fields for each scanned wifi
         *
         * {
         * "SSID": "The network name",
         * "BSSID": "The address of the access point",
         * "capabilities": "Describes the authentication, key management, and encryption schemes supported by the access point"
         * "frequency":"The primary 20 MHz frequency (in MHz) of the channel over which the client is communicating with the access point",
         * "level":"The detected signal level in dBm, also known as the RSSI. (Remember its a negative value)",
         * "timestamp":"Timestamp in microseconds (since boot) when this result was last seen"
         * }
         */
        wifi.loadWifiList((wifiStringList) => {
            var array = JSON.parse(wifiStringList);
            let wifiArray = [];

            for (let i = 0; i < array.length; i++) {
                let wifi = array[i].SSID;

                if (!wifiArray.includes(wifi)) {
                    wifiArray.push(wifi);
                }
            }
            this.setState({wifiArray: wifiArray});
        },
            (error) => {
                console.log(error);
            }
        );
    }

    rescanWiFiList = () => {
        /*
         * wifiStringList is a stringified JSONArray with the following fields for each scanned wifi
         *
         * {
         * "SSID": "The network name",
         * "BSSID": "The address of the access point",
         * "capabilities": "Describes the authentication, key management, and encryption schemes supported by the access point"
         * "frequency":"The primary 20 MHz frequency (in MHz) of the channel over which the client is communicating with the access point",
         * "level":"The detected signal level in dBm, also known as the RSSI. (Remember its a negative value)",
         * "timestamp":"Timestamp in microseconds (since boot) when this result was last seen"
         * }
         */
        wifi.reScanAndLoadWifiList((wifiStringList) => {
            var array = JSON.parse(wifiStringList);
            let wifiArray = [];

            for (let i = 0; i < array.length; i++) {
                let wifi = array[i].SSID;

                if (!wifiArray.includes(wifi)) {
                    wifiArray.push(wifi);
                }
            }
            this.setState({ wifiArray: wifiArray });
        }, (error) => {
            console.log(error);
        });
    }

    checkWiFiIsEnabled = (next) => {
        wifi.isEnabled((isEnabled) => {
            if (isEnabled) {
                console.log("wifi service enabled");
                if (next) next();
            } else {
                console.log("wifi service is disabled");
                wifi.setEnabled(true);
                console.log('Enable the WiFi');
            }
        });
    }

    componentDidMount = () => {
        try {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    this.checkWiFiIsEnabled(this.getList);
                } else {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            'title': 'Wifi networks',
                            'message': 'We need your permission in order to find wifi networks'
                        }
                    ).then((res) => {
                        if (res === PermissionsAndroid.RESULTS.GRANTED) {
                            console.log("Thank you for your permission!");
                            this.checkWiFiIsEnabled(this.getList);
                        } else {
                            console.log("You will not able to retrieve wifi available networks list");
                        }
                    })
                }
            });
        } catch (err) {
            console.warn(err)
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });

        this.checkWiFiIsEnabled(this.rescanWiFiList());

        setTimeout(() => {
            this.setState({refreshing: false});
        }, 2000);
    }

    render() {
        let { wifiArray, refreshing } = this.state;

        let WiFiList = wifiArray.map(wifi => {
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.container}>
                        <Text>{wifi}</Text>
                    </TouchableOpacity>
                </View>
            )
        });

        return (
            <ScrollView
                //contentContainerStyle={styles.root}
                style={styles.root}
                scrollEnabled={true}
                indicatorStyle={'white'}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                {WiFiList}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        width: width,
        height: height / 7,
        backgroundColor: 'white'
    }
})
