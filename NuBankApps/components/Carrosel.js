import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const width = screenWidth - 20;
const height = width * 0.5625;

export default class Carrosel extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        const {
            children,
            loading,
              ...attributes
            } = this.props;
        let inner = (loading && loading==true) ? <View style={[StyleSheet.absoluteFill, {alignItems:'center', justifyContent: 'center'}]}><ActivityIndicator color={"#ffffff"} /></View>: children;
        return (
            <View style={styles.carrosel}>
                <ScrollView horizontal={true} showsVerticalScrollIndicator={false} style={styles.carroselInner} contentContainerStyle={{flexDirection: 'row'}}>
                    {inner}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    carrosel: {
        width: screenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        marginBottom: 30,
    },
    carroselInner: {
        flex: 1
    },
    carroselArrows: {
        height: height,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: 30,
        fontSize: 30,
        color: '#c0b8b8',
        alignItems: 'center',
        justifyContent: 'center',
    },
});