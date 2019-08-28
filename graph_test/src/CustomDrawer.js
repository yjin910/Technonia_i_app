import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList
} from 'react-native'
import PropTypes from "prop-types";
import uuidv1 from 'uuid/v1';


const { width } = Dimensions.get('window');
const menu = [
    { title: 'ListView' },
    { title: 'Tooltip' },
]

export default class CustomDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //
        }
    }

    static propTypes = {
        changeTooltipMode: PropTypes.func
    };

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <FlatList
                        style={{ flex: 1.0 }}
                        data={menu}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity style={styles.menuTitleContainer} key={uuidv1()}>
                                    <Text style={styles.menuTitle} key={index}>
                                        {/* {item.title} */}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
    },
    menuTitleContainer: {
        alignItems: 'center',
        height: 60,
        width:'100%',
        flexDirection:'row',
    },
    menuTitle: {
        width:'100%',
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        alignSelf:'center',
    },
});
