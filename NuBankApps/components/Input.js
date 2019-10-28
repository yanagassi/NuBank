import React from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

export default class Input extends React.Component {
  constructor(props) {
      super(props);
      this.state = {text: '', is_loading: false};
  }
  render() {
    const { placeholder, loading, onChangeText,placeHolderColor, value, type, multiline, secureTextEntry, returnKeyType, style, textColor } = this.props;
    let _placeholder = (!placeholder)? '':placeholder;
    let _is_loading = (!loading)? false: loading;
    let _onChangeText = (!onChangeText)? ()=>{}: onChangeText;
    let _value = (!value)? this.state.text:value;
    let _multiline = (!multiline)? false: multiline;
    let _textContentType = (!type)? 'none': type;
    let _placeHolderColor =  placeHolderColor;
    let _returnKeyType = (!returnKeyType)? 'none': returnKeyType;
    let _secureTextEntry = (!secureTextEntry)? false: secureTextEntry;
    let _textColor = !textColor? {} : {color: textColor};
    if(type=='password') _secureTextEntry = true;

    let _style = (!style)? {}: style;

    if(_is_loading==true){
        return (<View style={[styles.container, _style]}>
                  <View style={styles.textInput}><ActivityIndicator color={Colors.inputPlaceholder} /></View>
                </View>);
    } else { 
        return (
          <View style={[styles.container, _style]}>
            <TextInput secureTextEntry={_secureTextEntry} placeholderTextColor={_placeHolderColor}  textContentType={_textContentType} returnKeyType={_returnKeyType} multiline={_multiline} placeholder={_placeholder} onChangeText={(text) => {this.setState({text}); _onChangeText(text)}} value={_value} style={[styles.textInput, _textColor]} underlineColorAndroid={'transparent'} />
          </View>
        );
    }
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
    alignSelf: 'stretch',
    flexDirection: 'row',
    minHeight: 40,
    borderWidth: 1,
    borderColor: Colors.inputPlaceholder
  },
  textInput: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    color: "#222"
 },
});