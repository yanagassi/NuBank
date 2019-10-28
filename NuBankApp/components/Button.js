import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Colors from '../constants/Colors';

export default class Button extends React.Component {
    render() {
        
        const { 
            children,
            color,
            loading,
            square,
            style,
              ...attributes
            } = this.props;
            let _style = (!style)? {}: style;
            let _buttonColor = (!color)? Colors.button: color;
        let inner = (loading && loading==true) ? <ActivityIndicator color={"#ffffff"} />: children;
        return <View style={[styles.container, {backgroundColor: _buttonColor}, _style]}>
                    <TouchableOpacity style={styles.button} disabled={loading} {...attributes}>
                        <View style={{}}>
                            {inner}
                        </View>
                    </TouchableOpacity>
                </View>;
    } 
} 

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.input,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        margin: 10,
        borderRadius: 0,

        borderColor:'white',
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
        height: 50,
        
        minWidth: 70
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        flex: 1
    }
});