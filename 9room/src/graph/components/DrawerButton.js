import React from 'react'
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import PropTypes from "prop-types";


export default class DrawerButton extends React.Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        title: PropTypes.func.isRequired,
    };

    render() {
        let {onPress, title} = this.props;
        return (
            <TouchableOpacity onPress={onPress} style={styles.menuTitleContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    menuTitleContainer: {
        alignItems: 'center',
        height: 60,
        width: '100%',
        flexDirection: 'row',
        borderColor: 'red',
        borderWidth: 1
    },
    menuTitle: {
        width: '100%',
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        alignSelf: 'center',
    },
});
