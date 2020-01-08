import React from 'react'
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    View
} from 'react-native';
import PropTypes from "prop-types";


const COPYRIGHT_IMG = require('../../../assets/copyright.png');
const HELP_IMG = require('../../../assets/help.png');
const LOGOUT_IMG = require('../../../assets/logout.png');
const MAIN_IMG = require('../../../assets/main.png');
const PROFILE_IMG = require('../../../assets/profile.png');
const SETTING_IMG = require('../../../assets/setting.png');

export default class DrawerButton extends React.Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
    };

    render() {
        let {onPress, title} = this.props;

        let img;

        switch (title) {
            case 'Setting':
                img = SETTING_IMG;
                break;
            case 'Log out':
                img = LOGOUT_IMG;
                break;
            case 'Main':
                img = MAIN_IMG;
                break;
            case 'Profile':
                img = PROFILE_IMG;
                break;
            case 'Help':
                img = HELP_IMG;
                break;
            case 'Copyright':
                img = COPYRIGHT_IMG;
                break;
            default:
                console.log('Invalid title: ', title);
        }

        return (
            <TouchableOpacity onPress={onPress} style={styles.menuTitleContainer}>
                <View style={styles.innerContainer}>
                    <Image source={img} style={styles.img} />
                    <Text style={styles.menuTitle}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
  menuTitleContainer: {
    alignItems: "center",
    height: 60,
    width: "100%",
    //flexDirection: "row",
    borderBottomColor: "#bbbbbb",
    //justifyContent: "space-around",
    justifyContent: "center",
    borderBottomWidth: 0.5
  },
  menuTitle: {
    //width: '100%',
    flex: 1,
    color: "white",
    textAlign: "center",
    fontSize: 17,
    alignSelf: "center",
  },
  img: {
    width: 30,
    height: 30,
    alignSelf: "center",
    marginLeft: 15
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
