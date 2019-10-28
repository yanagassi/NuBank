import React from 'react';
import {View} from 'react-native'
import {
  Logo, Title,
} from './styles';

import Icon from 'react-native-vector-icons/MaterialIcons';

import logo from '../../assets/images/Nubank_Logo.png';
import { umNome } from '../../utils';

export default class Header extends React.Component  {

 
  constructor(props){
    super(props);
    this.state = {
      user : JSON.parse(this.props.user)
    } 
  }
 
  render(){
    return (
      <View style={{alignItems: "center", paddingTop:40 , paddingLeft: 30}}  >
      <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          marginTop: -150,
        }}> 
          <Logo source={logo} />
          <Title>{ umNome( this.state.user.name )}</Title>
        </View>
        <Icon name="keyboard-arrow-down" style={{marginTop:-60}} size={20} color="#FFF" />
      </View>
    );
  }
}
