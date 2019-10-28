import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  Alert
} from 'react-native';
import Colors from '../constants/Colors';
import DownloadObject from '../models/DownloadObject';
import Layout from '../constants/Layout';
import ImageCache from '../components/ImageCache';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as Icon from '@expo/vector-icons';

const width = Layout.window.width;
const height = width * 0.5625;
const boxHeight = 60;

export default class CentralDownloads extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            showMessage: false,
            messageText: '',
            messageTop: new Animated.Value(0),
            mostrarCentral: false,
            anitin:false,
            downloadList: [],
            localList: []
        }
        this.downloadLicao = this._downloadLicao.bind(this);
        this.criarDownload = this.criarDownload.bind(this)
    }

    componentDidMount(){
        this.getLocalList();
    }

    _removeFromList(id = '', stop = false){
       
        let curDownloadList = this.state.downloadList;
        if(stop===true){
            for (let index = 0; index < curDownloadList.length; index++) {
                const dl = curDownloadList[index];
                if(dl.id===id){
                    curDownloadList[index].downloadProgress = progress;
                    break;
                }
            }
        }

        curDownloadList = curDownloadList.filter((i)=>i.id!==id);

        this.setState({downloadList: curDownloadList});
    }


    _updateProgress(id = '', progress = 0){
       
        let curDownloadList = this.state.downloadList;
        for (let index = 0; index < curDownloadList.length; index++) {
            const dl = curDownloadList[index];
            if(dl.id===id){
                curDownloadList[index].downloadProgress = progress;
                break;
            }
        }

        this.setState({downloadList: curDownloadList});
    }

    _updateDlStatus(id = '', status = true){
        let curDownloadList = this.state.downloadList;
        for (let index = 0; index < curDownloadList.length; index++) {
            const dl = curDownloadList[index];
            if(dl.id===id){
                if(status===false) curDownloadList[index].pause();
                else curDownloadList[index].resume();
                break;
            }
        }

        this.setState({downloadList: curDownloadList});
    }

    showAlert(status){
        switch (status) {
            case 2:
                Alert.alert("Ops, erro no download.","Não foi possível baixar o PocketBook, tente novamente.");
                break;
            case 3:
                Alert.alert("PocketBook baixado!","Seu PocketBook já se encontra em sua biblioteca.");
                break;
            default:
                break;
        }
    }
   
    async criarDownload(fileName = '', downloadSource = '', downloadTitle = '', data = {}){
        let curDownloadList = this.state.downloadList;
        let downloadObject = null;
        Alert.alert('Download Iniciado', 'Seu PocketBook está sendo baixado, os progressos do download pode ser visualizado na aba "Mais".')
        try{
            const permissions = Permissions.CAMERA_ROLL;
            const status = await Permissions.getAsync(permissions);
     
            downloadObject = new DownloadObject({
                fileName, // apenas o nome do arquivo sem o caminho
                downloadSource, //https://...
                downloadTitle, //titulo para lista de downloads
                data,
                //downloadThumb: "", //imagem de icone para lista de downloads
                // downloadStartCallback: ()=>{}, // função quando começar
                downloadStatusChangeCallback: (newStatus)=>{
                    this.showAlert(newStatus)
                }, //quando status do download mudar
                downloadErrorCallback: (error)=>{
                    console.log("Error:::", error);
                }, // se der algum erro
            });

            downloadObject.downloadProgressCallback = (progress)=>{
                this._updateProgress(downloadObject.id, progress);
            };

            downloadObject.downloadEndCallback = ()=>{
                this._removeFromList(downloadObject.id);
                this.getLocalList();
            };

            downloadObject.downloadStopCallback = ()=>{
                this._removeFromList(downloadObject.id);
            };
            
            downloadObject.start();

            /*
                downloadObject.start() -> para começar o download
                downloadObject.pause() -> para pausar o download
                downloadObject.resume() -> para continuar o download
                downloadObject.recover(id) -> para recuperar um download quando o app é fechado ou algo assim
                                            LEMBRAR DE SALVAR O ID DOS DOWNLOADS QUE ESTÃO ACONTECENDO CASO SEJA NECESSÁRIO RECUPERAR
                                            ESSA FUNÇÃO VAI SERVIR TAMBÉM PARA DAR A OPÇÃO DO USUÁRIO BAIXAR SÓ NO WI-FI
                                            CASO A FONTE DE INTERNET MUDE PAUSA O DOWNLOAD, QUANDO VOLTAR A SE WI-FI CONTINUA..
            */

            //Adicionando download à lista
            curDownloadList.push(downloadObject);
            this.setState({downloadList: curDownloadList});
        }catch(e){
             console.log("erro: " + e)
            return;
        } 
    }

    messageTO = null;
    _showMessage(text = ''){
        clearTimeout(this.messageTO);
        this.setState({
            mostrarCentral: true,
            showMessage: true,
            messageText: text
        }, ()=>{
            Animated.timing(this.state.messageTop, {
                toValue: 0,
                duration: 1000,
            }).start();
        });
        this.messageTO = setTimeout(()=>{
            Animated.timing(this.state.messageTop, {
                toValue: -Layout.window.height,
                duration: 1000,
            }).start(()=>{
                this.setState({
                    showMessage: false,
                    messageText: ""
                });
            });
        }, 4000);
    }

    _downloadLicao(name_file,link_mp3 = '',name_apparent=''){     //Iniciei a Função de Donwload.
        this.criarDownload(name_file+'.mp3', link_mp3, name_apparent);
    }

    openCentral(a=false){
        this.setState({
            anitin:true
        })
    }

    async getLocalList(){
        try {
            let fl = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}download/`);
            fl = fl.filter((f)=>f.indexOf('.vdata') > -1);
            let localList = [];
            for (const file of fl) {
                let info = JSON.parse(await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}download/${file}`));
                localList.push({path: `${FileSystem.documentDirectory}download/${file}`, ...info});
            }
            this.setState({localList});
        } catch (error) {
        }
    }

    deleteLocalFileAlert(path = ''){
        Alert.alert(
            'Arquivo local',
            'Tem certeza que deseja apagar este arquivo?',
            [
              {text: 'Cancelar', onPress: () => true, style: 'cancel'},
              {text: 'Apagar', onPress: () => {
                  this.deleteLocalFile(path);
              }},
            ],
            { cancelable: false }
          )
    }

    async deleteLocalFile(path = ''){
        if(typeof path !== 'string') return;
        if(path.length===0) return;
        try {
            await FileSystem.deleteAsync(path.replace('.vdata', ''));
            await FileSystem.deleteAsync(path);
            this.getLocalList();
        } catch (error) {
            console.log('deleteLocalFile',error);
        }
    }

    render() {
        /* TEM QUE FAZER A PARTE GRÁFICA DA LISTA DE DOWNLOAD - PODE FAZER UM MODAL, SÓ NÃO ESQUECE DE DEIXAR UM BOTÃO PARA FECHAR O MODAL */
        return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    <Modal
                        animationType="slide"
                        transparent={false}                        
                        visible={this.state.anitin}>
                        <View style={{flex:1, backgroundColor:Colors.primary, height: Layout.window.height}}>
                            <View style={{marginTop: 40, height: 50, flexDirection: 'row', alignItems:'center'}}>
                                <TouchableOpacity style={{width: 50, height: 50, justifyContent:'center', alignItems:'center'}} onPress={()=>{this.setState({anitin: false})}}>
                                    <Icon.Ionicons name={Platform.select({ios: "ios-arrow-back", android: 'md-arrow-back'})} size={22} style={{}} color={Colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.title}>Seus Downloads</Text>
                            </View>
                            <Text style={styles.subtitle}>Baixando agora</Text>
                            {
                            this.state.downloadList.map((dl, di)=>(
                                <View style={styles.downloadItem}>
                                    <Text style={styles.downloadItemTitle}>{dl.downloadTitle}</Text>
                                    <View style={styles.downloadOptions}>
                                    {
                                        dl.status == dl.DOWNLOAD_STATUS.STARTING?
                                        <ActivityIndicator color={Colors.text} />
                                        : (
                                        dl.status == dl.DOWNLOAD_STATUS.PAUSED?
                                        (<TouchableOpacity style={{width: 50, height: 50, justifyContent:'center', alignItems:'center'}} onPress={()=>{this._updateDlStatus(dl.id, true)}}>
                                            <Icon.Ionicons name={Platform.select({ios: "ios-play", android: 'md-play'})} size={22} style={{}} color={Colors.text} />
                                        </TouchableOpacity>):
                                        (<TouchableOpacity style={{width: 50, height: 50, justifyContent:'center', alignItems:'center'}} onPress={()=>{this._updateDlStatus(dl.id, false)}}>
                                            <Icon.Ionicons name={Platform.select({ios: "ios-pause", android: 'md-pause'})} size={22} style={{}} color={Colors.text} />
                                        </TouchableOpacity>))
                                    }
                                    <TouchableOpacity style={{width: 50, height: 50, justifyContent:'center', alignItems:'center'}} onPress={()=>{dl.cancel()}}>
                                        <Icon.Ionicons name={Platform.select({ios: "ios-close", android: 'md-close'})} size={22} style={{}} color={"#ff6360"} />
                                    </TouchableOpacity>
                                    </View>
                                    <View style={styles.progressBarWrap}>
                                        <View style={[styles.progressBar, {flex: dl.downloadProgress}]}></View>
                                    </View>
                                </View>
                            ))
                        }
                        {this.state.downloadList.length===0 && <Text style={styles.note}>Nenhum baixando agora.</Text>}
                        <Text style={styles.subtitle}>Meus arquivos baixados</Text>
                        {
                            this.state.localList.map((dl, di)=>(
                                <View style={styles.downloadItem}>
                                    <Text style={styles.downloadItemTitle}>{dl.titulo}</Text>
                                    <View style={styles.downloadOptions}>
                                    <TouchableOpacity style={{width: 50, height: 50, justifyContent:'center', alignItems:'center'}} onPress={()=>{this.deleteLocalFileAlert(dl.path)}}>
                                        <Icon.Ionicons name={Platform.select({ios: "ios-trash", android: 'md-trash'})} size={22} style={{}} color={Colors.text} />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        {this.state.localList.length===0 && <Text style={styles.note}>Nenhum arquivo baixado ainda.</Text>}
                        </View>
                </Modal>
                </View>;
    }
}

const styles = StyleSheet.create({
    snackBar: {
        backgroundColor: Colors.primary,
        color: Colors.text,
        alignItems:'center',
        justifyContent: 'center',
        width: width,
        padding: 20,
        position: 'absolute',
        left: 0,
        top: -Layout.window.height,
        display: 'none'
    },
    downloadItem: {
        backgroundColor: '#F9F9F9',
        padding: 10,
        width: width,
        minHeight: boxHeight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 1,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowOpacity: 0.1
          }, 
          android: {
            elevation: 1
          }
      })
      },
      downloadItemTitle: {
        fontSize: 16,
        color: Colors.text,
      },
      title: {
        fontSize: 18,
        color: Colors.text,
        fontWeight:'bold',
        textAlign: 'center',  
      },
      subtitle: {
        fontSize: 14,
        color: Colors.text,
        fontWeight:'bold',
        textAlign: 'center',
        marginVertical: 10  
      },
      downloadOptions: {
        flexDirection: 'row'
      },
      progressBarWrap: {
        backgroundColor: Colors.inputPlaceholder,
        flexDirection: 'row',
        height: 2,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      },
      progressBar: {
        height: 2,
        backgroundColor: Colors.text
      },
      note: {
        fontSize: 10,
        color: Colors.text,
        textAlign: 'center',
        marginVertical: 10,
        opacity: 0.8 
      },
});