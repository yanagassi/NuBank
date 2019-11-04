import React from 'react';
import {
  Image, 
  StyleSheet, Alert,
  Text,TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import axios from 'axios';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Button from '../components/Button';
import Api from '../constants/Api';
const height = Math.round(Dimensions.get('window').height);

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
      super(props); 
      this.state = {
        phone: "5532988442172",
        senha:"123456"
       }
      this.store = this.props.screenProps.s;
  }
 
  login(){
    let phone= this.state.phone;
    let password = this.state.senha;
    if(phone.length<=4) return;
    if(password.length<=4) return;

    this.setState({loading: true});
    var formData = new URLSearchParams();  
    formData.append('phone', phone.toLowerCase());
    formData.append('senha', password);

    axios.post( Api.uri + "users/login", formData)
    .then(res => {
      res = res.data;
      console.log(res)
      if(res.status === "sucess"){ 
        alert(JSON.stringify(usuario))
        this.store.set('usuario', JSON.stringify(res.data));
      }else{ 
        Alert.alert("Ops...",res.msg);
      }
      this.setState({loading: false});
    })
    .catch(e=>{
      console.log(e)
      Alert.alert("Ops...","Não foi possível fazer o login, tente novamente mais tarde.");
      this.setState({loading: false});
    });
  }
   
  render() {

    return (
        <View style={{height:'100%', paddingTop:(height*1) - height, backgroundColor:"#8A05BE"}} >

          <View style={[styles.container, {flexDirection: "column",flex:1,alignItems:'center', backgroundColor:"#8A05BE"}]}>
            <Image resizeMode={"contain"} style={{width: 250, height: 250, marginBottom: 20,marginTop:-50}} source={require('./../assets/images/nublogo.png')} />
            <View style={[styles.busca,{marginTop:10}]}>
              <View style={[styles.searchSection,{marginTop:-10}]}>
              <Icon.Foundation style={[styles.searchIcon, {padding:10}]} name="telephone" size={20} color={"#8A05BE"}/>
                <TextInput
                    style={styles.input}
                    placeholder=" +63 915 4443 812"
                    value={this.state.phone}
                    onChangeText={(phone)=>this.setState({phone})}
                    underlineColorAndroid="transparent"
                />
              </View>
            </View>


            <View style={[styles.busca ]}>
              <View style={[styles.searchSection,{marginTop:1}]}>
              <Icon.Feather style={[styles.searchIcon, {padding:10}]} name="lock" size={20} color={"#8A05BE"}/>
                <TextInput
                    style={styles.input}
                    placeholder=" *********"
                    value={this.state.senha}
                    secureTextEntry={true}
                    onChangeText={(senha)=>this.setState({senha:senha})}
                    underlineColorAndroid="transparent"
                />
              </View>
            </View>
            
            <Button style={{width:'90%', alignSelf:'center',  marginTop:30, borderWidth:0.5, borderColor:"#fff"}} onPress={()=>{this.login()}} loading={this.state.loading} color={'#8A05BE'}>
              <Text style={{color:'white',fontSize:17  }}>Entrar</Text>
              </Button>
           
            <TouchableOpacity  style={{marginTop:15,}} >
              <Text style={{color:'white', fontSize:17 }}>Esqueceu sua senha?</Text>
            </TouchableOpacity> 
          </View> 
        </View>

    );
  }

}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:0 ,
    backgroundColor: '#EBEBEB',
    height:50,
    width:'90%',
  },
  container: {
    flex: 1,
    height:'100%',
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  busca:{
 
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: 'transparent',
    color: 'black',
},
  statusBar: {
    backgroundColor: "white",
    height:20,
  },

});
