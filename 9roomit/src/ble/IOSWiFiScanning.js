import React from 'react'
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    RefreshControl
} from 'react-native'


export default class IOSWiFiScanningScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wifiArray = [],
            refreshing: false
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    onRefresh = () => {
        this.setState({refreshing: true});
        //TODO
    }

    render() {
        let { wifiArray, refreshing } = this.state;

        let WiFiList = wifiArray.map(w => {
            return (
                <View style={styles.container}>
                    <TouchableOpacity style={styles.container}>
                        <Text></Text>
                    </TouchableOpacity>
                </View>
            )
        });

        return (
            <ScrollView
                contentContainerStyle={styles.root}
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
        flex: 1
    },
    container: {
        flex: 1
    }
})
