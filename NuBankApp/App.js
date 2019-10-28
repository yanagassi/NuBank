import React from 'react';
import { Platform, StatusBar, StyleSheet, Alert,View, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { AppLoading } from 'expo'; 
import { Asset } from 'expo-asset';
import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';
import Storage from './classes/Storage';
import FileCache from './classes/FileCache';
import LoginScreen from './pages/Login'; 

 
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLoggedIn: true,
    onBoarding:false,
    downloadExists:true,
  };

  store = null;
  filecache = null;


  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
           <StatusBar barStyle={Platform.OS == "ios"?  'dark-content' :  "default" }/> 

              <KeyboardAvoidingView 
          behavior='padding'
          style={{flex:1,  }}
          keyboardVerticalOffset={ 
          Platform.select({
            ios: () => 0,
            android: () => 0
          })()
        }>


              {(this.state.isLoggedIn==true)
              ?<AppNavigator screenProps={{s: this.store, fc: this.filecache}} style={{paddingTop:50}} />
              :<LoginScreen  screenProps={{ s: this.store, fc: this.filecache}} />}
          </KeyboardAvoidingView>
        </View>
      );
    }
  }

  ligaOnBoard(){
    this.store.set('onboarding', true);
    this.setState({onBoarding:true})
  }

  offOnBoard(){
    this.setState({onBoarding:false})
  }

  getPlayer(){
    if(this.player!==undefined)
      return this.player;
    return {};
  }

  downloadPocketBook(name_file,link_mp3,name_apparent,data){
    this.refs.dw.criarDownload(name_file,link_mp3,name_apparent,data)
  }

  dowloadLicao(licao = {}, CURSO_ID = null){
    this.refs.dw.downloadLicao(licao, CURSO_ID)
  }

  openCentral(a =false){
    if(typeof a == undefined) return;
    this.refs.dw.openCentral(a);
  }

  playerOpenCurso(id){
    if(Platform.OS === 'ios'){
      this.refs.player.loadCurso(id);
    }else{
      this.refs.PlayerAndroid.load_curso(id)
    }
  }


  exits(){
    this.refs.PlayerAndroid.exits();
  }
  
  playerOpenCast(castObject){
    if(Platform.OS === 'ios'){
      console.log(castObject)
      this.refs.player.loadCast(castObject);
    }else{
      this.refs.playerVTS.load_vts(castObject);
    }
  }

  playPocketCast(pocketCast){
    this.refs.pocketCast.initPocketCast(pocketCast);
  }

  

  componentDidMount(){

     
 
    this.store.watch('onboarding',(data)=>{
      if(data !== null || data !== undefined){
        this.offOnBoard()
      } else{
        this.ligaOnBoard()
      }
    })  
    this.store.watch('usuario', (data)=>{
      if(data !== null && data !== undefined){
        this.setState({isLoggedIn: true});
      } else {
        this.setState({isLoggedIn: false});
      }
    });
  }

  _loadResourcesAsync = async () => {
    this.store = new Storage;
    this.filecache = new FileCache;
    return Promise.all([
      Asset.loadAsync([
        './assets/assets/images/no-image.jpg','./assets/images/logo.png',
        './assets/images/error_location.png','./assets/images/logo_splash.jpg',
        './assets/images/extend_logo.jpg'
      ]), 
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
