import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native'
import PropTypes from "prop-types";
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import I18n from '../../i18n'

const { width } = Dimensions.get('window');

export default class DataText extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        types: PropTypes.string.isRequired,
        currentTemp: PropTypes.number,
        currentHumi: PropTypes.number,
        currentGeiger: PropTypes.number,
        maxTemp: PropTypes.number,
        minTemp: PropTypes.number,
        maxHumi: PropTypes.number,
        minHumi: PropTypes.number,
        maxGeiger: PropTypes.number,
        minGeiger: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string
    };

    render() {
        let { currentTemp, maxTemp, minTemp, currentHumi, maxHumi, minHumi, currentGeiger, minGeiger, maxGeiger, types, startDate, endDate } = this.props;

        switch (types) {
            case 't':
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`${I18n.t('start')} ${startDate}`}</Text>
                            <Text style={styles.text}>{`${I18n.t('end')} ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('curT')} ${currentTemp} ºC`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('maxT')} ${maxTemp} ºC`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('minT')} ${minTemp} ºC`}</Text>
                        </View>
                    </View>
                )
            case 'h':
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`${I18n.t('start')} ${startDate}`}</Text>
                            <Text style={styles.text}>{`${I18n.t('end')} ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('curH')} ${currentHumi} %`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('maxH')} ${maxHumi} %`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('minH')} ${minHumi} %`}</Text>
                        </View>
                    </View>
                )
            case 'g':
                return (
                    <View style={styles.container}>
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.text}>{`${I18n.t('start')} ${startDate}`}</Text>
                            <Text style={styles.text}>{`${I18n.t('end')} ${endDate}`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('curG')} ${currentGeiger} μSv`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('maxG')} ${maxGeiger} μSv`}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{`${I18n.t('minG')} ${minGeiger} μSv`}</Text>
                        </View>
                    </View>
                )
            case 'th':
                let tableHead = ['', '온도', '습도'];
                let tableTitle = ['현재', '최대', '최소']
                let tableData = [[`${currentTemp} ºC`, `${currentHumi} %`], [`${maxTemp} ºC`, `${maxHumi} %`], [`${minTemp} ºC`, `${minHumi} %`]]
                return (
                    <View style={styles.tableContainer}>
                        <Table style={styles.table}>
                            <Row data={tableHead} flexArr={[2, 3, 3]} style={styles.head} textStyle={styles.tableText} />
                            <TableWrapper style={styles.wrapper}>
                                <Col data={tableTitle} style={styles.title} heightArr={[28, 28, 28]} textStyle={styles.tableText} />
                                <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.tableText} />
                            </TableWrapper>
                        </Table>
                    </View>
                )
            default:
                return (
                    <View style={styles.textContainer}></View>
                );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: width / 15,
        marginBottom: width / 15,
    },
    textContainer: {
        width: width,
        alignItems: 'flex-start',
    },
    dateTextContainer: {
        width: width,
        alignItems: 'flex-start',
        marginBottom: width / 30
    },
    text: {
        fontSize: width / 25,
        marginHorizontal: width / 5
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    wrapper: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        backgroundColor: '#f6f8fa'
    },
    row: {
        height: 28
    },
    tableText: {
        textAlign: 'center'
    },
    table: {
        flex: 1
    },
    tableContainer: {
        marginTop: width / 15,
        marginBottom: width / 15,
        width: width / 3 * 2,
        alignContent: 'center',
        marginLeft: width / 6,
    }
});
