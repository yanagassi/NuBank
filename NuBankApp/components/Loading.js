import React from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,ActivityIndicator,Dimensions,
  View,ScrollView,Text
 
} from 'react-native';
import Constants from 'expo-constants';
import * as Icon from '@expo/vector-icons';
const screenWidth = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);


export default class Loading extends React.Component {

    render(){
        return(
            <ScrollView style={{backgroundColor:'white', height:'100%', paddingTop:Constants.statusBarHeight, minHeight:height}}>
                <View style={[styles.busca,{ height:50, marginBottom:10,  flexDirection:'row', width:'100%'}]}>
                     
                    <Image resizeMode={"contain"} style={{width: '100%', height:40, marginTop:15,}} source={require('./../assets/images/logo.png')} />
                    
                </View>
                <View style={{height:1, width:'100%', backgroundColor:"#f2f2f2", marginTop:-5, marginRight:20}}></View>
                <ActivityIndicator size="large" color="#884399" style={{marginTop:height/3}} />
                <Text style={{width:'70%', alignSelf:'center', fontWeight:'500',color:'#884399',fontSize:14, textAlign:'center',marginTop:5 }}>Carregando...</Text>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({

    shadow:{
      shadowColor: "red",
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity:1,
      shadowRadius: 1,
  
      elevation: 5,
    },
    container:{
      backgroundColor:"#F5F5EF",
  
      width:'100%',
      height:'100%',
      alignSelf:'center',
    }, 
    img_caroussel:{
      width:100,
      height:100
    },
    busca:{
      alignItems:'center',
      width:'100%',
      alignSelf:'center',
      backgroundColor:'#fff',
      justifyContent:'center',
      paddingBottom:15
    },
     
    searchSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:5,
      backgroundColor: '#EBEBEB',
      height:50,
      width:'90%',
    },
    searchIcon: {
  
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
    filtros:{
      
    }
  
  });
  
