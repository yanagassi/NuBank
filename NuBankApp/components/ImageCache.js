import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class ImageCache extends React.Component {
  constructor(props) {
      super(props);
      const { source } = this.props;
      this.state = {
          source: require('./../assets/images/no-image.jpg'),
          loading: true
      };
  }
  

  async _download(url = null, filename = null){
        if(url==null || filename == null) return;
        return FileSystem.downloadAsync(
            url,
            FileSystem.cacheDirectory + filename
        );
    }

  componentDidMount(){
    const { source } = this.props;
    if(typeof source !== 'string') return this.setState({loading: false});
    let filename = source.split('/').join('.').split(':').join('.').split(' ').join('_').split('?')[0];
    FileSystem.getInfoAsync(FileSystem.cacheDirectory + filename).then((r)=>{
        if(r.exists==true){
            this.setState({
                source: {uri: r.uri},
                loading: false
            });
        } else {
            this.setState({
                source: {uri:source},
                loading: false
            });
            this._download(source, filename);
        }
    }).catch(err2=>{
        this.setState({
            loading: false
        });
    });
  }

  render() {
    const { source, style, resizeMode, ...props } = this.props;
    const _resizeMode = resizeMode? resizeMode: 'cover';
    return (    
        <View style={[styles.container, style]}>
            {
            this.state.loading===true? <ActivityIndicator />
            :<Image style={[StyleSheet.absoluteFill, style]} resizeMode={_resizeMode} defaultSource={require('./../assets/images/no-image.jpg')} source={this.state.source} {...props} />
            }
        </View>
    );
  }
    
}

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      justifyContent: 'center',
  },

});