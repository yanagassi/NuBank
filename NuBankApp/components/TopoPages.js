import React from 'react';
import {
    View,Text,Image,StyleSheet
} from 'react-native';


export default class TopoPages extends React.Component{

  

    constructor(props){
        super(props)
        this.state = {
            empty: require('./../assets/images/no-image.jpg'),
        };
    }

    render(){
        return(
            <View  >
             
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topoCont:{
      padding:10,
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
      borderBottomWidth:1,
      borderBottomColor:'grey',
      marginBottom:5,
      width:'100%'
    },
    avatar:{
      width: 30,
      height: 30,
      backgroundColor: '#ddd',
      borderRadius: 15,
      marginRight: 10
    },
    titulos:{
      color: 'black',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
    }
})