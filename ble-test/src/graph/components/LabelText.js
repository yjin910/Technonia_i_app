import Svg, { Line } from 'react-native-svg'
import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'
import PropTypes from "prop-types";

const { width } = Dimensions.get('window');

export default class LabelText extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        types: PropTypes.string.isRequired
    };

    render() {
        let { types } = this.props;

        switch (types) {
            case 't':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{'온도'}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='red'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                )
            case 'h':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{`습도`}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='blue'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                )
            case 'th':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{'온도'}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='red'>
                                </Line>
                            </Svg>
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{`습도`}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='blue'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                );
            case 'g':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{'방사선'}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='green'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                );
            case 'th':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{'온도'}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='red'>
                                </Line>
                            </Svg>
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{`습도`}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='blue'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                );
            case 'gth':
                return (
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{'온도'}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='red'>
                                </Line>
                            </Svg>
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{`습도`}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='blue'>
                                </Line>
                            </Svg>
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.text}>{`방사선`}</Text>
                            <Svg height={width / 30} width={width / 5}>
                                <Line x1={0} y1={width / 60} x2={width / 5} y2={width / 60} stroke='green'>
                                </Line>
                            </Svg>
                        </View>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text>Invalid type!</Text>
                    </View>
                );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        alignItems: 'center',
        marginTop: width / 30
    },
    text: {
        fontSize: width / 30,
        marginLeft: width / 4,
        marginRight: width / 40,
    },
    labelContainer: {
        width: width,
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: width / 30
    }
});