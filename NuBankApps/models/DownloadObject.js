import ObjectModel from './ObjectModel';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import {Alert} from 'react-native';

const DOWNLOAD_STATUS_STARTING = 0;
const DOWNLOAD_STATUS_DOWNLOADING = 1;
const DOWNLOAD_STATUS_PAUSED = 2;
const DOWNLOAD_STATUS_DONE = 3;
const  filePath = FileSystem.documentDirectory + 'download/';
let fileName = "";

export default class DownloadObject extends ObjectModel {   
    id = this.genID(15);
    fileName = "";
    tempFile = filePath + this.fileName + ".mp3";
    endFile = filePath + this.fileName;
    dataFile = filePath + this.fileName + ".vdata";
    data = {};
    downloadSource = ""; //https://...
    downloadTitle = "";
    downloadThumb = "";
    downloadProgress = 0;
    downloadEndCallback = ()=>{};
    downloadStartCallback = ()=>{ };
    downloadProgressCallback = (progress)=>{ };
    downloadStatusChangeCallback = (newStatus)=>{ };
    downloadErrorCallback = (error)=>{ };
    downloadStopCallback = ()=>{};
    downloadSize = 0;
    DOWNLOAD_STATUS = {
        STARTING: DOWNLOAD_STATUS_STARTING,
        DOWNLOADING: DOWNLOAD_STATUS_DOWNLOADING,
        PAUSED: DOWNLOAD_STATUS_PAUSED,
        DONE: DOWNLOAD_STATUS_DONE
    };
    
    async _getPermissions(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }   

    status = DOWNLOAD_STATUS_STARTING
    _download = null;
    _savable = null
    
    constructor(object = {}, key = ''){
        super(object, key);
        this._getPermissions();
        this.set(object, key);
        this.tempFile = filePath + this.fileName + ".vdl";
        this.endFile = filePath + this.fileName;
        this.dataFile = filePath + this.fileName + ".vdata";
        this._checkDir();   

        this._download = FileSystem.createDownloadResumable(
            this.downloadSource, this.tempFile, {}, downloadProgress => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                this.downloadSize = downloadProgress.totalBytesExpectedToWrite;
                this.downloadProgress = progress;
                if(typeof this.downloadProgressCallback === 'function') this.downloadProgressCallback(progress);
              }
          );
        this._savableUpdate();
    }

    async _checkDir(){
        try {
            await FileSystem.makeDirectoryAsync(filePath, {intermediates: true});
        } catch (error) {
            console.log('Dir error', error);
        }
    }

    _statusUpdate(status = 0){
        if(typeof status !== "number") return;
        this.status = status;
        if(typeof this.downloadStatusChangeCallback === 'function') this.downloadStatusChangeCallback(this.status);
    }

    async _savableUpdate(){
        this._savable = this._download.savable();
        try {
            await FileSystem.writeAsStringAsync(filePath + this.id, JSON.stringify(this.toJSON()));
        } catch (error) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'savable', error: e});
        }
    }

    async _rename(uri = '') {
        if(typeof uri !=="string") return;
        try {
            await FileSystem.moveAsync({
                from: uri,
                to: this.endFile
            });
            await FileSystem.deleteAsync(filePath + this.id, { idempotent: true });
            await FileSystem.writeAsStringAsync(this.dataFile, JSON.stringify(this.data));
            this._statusUpdate(DOWNLOAD_STATUS_DONE);   
            if(typeof this.downloadEndCallback === 'function') this.downloadEndCallback();
        } catch (e) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'rename', error: e});
        }
    }

    async start(){
        if(typeof this.downloadStartCallback === 'function') this.downloadStartCallback();
        this._statusUpdate(DOWNLOAD_STATUS_DOWNLOADING);      
        try {
            const { uri } = await this._download.downloadAsync();
            this._rename(uri);
          } catch (e) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'start', error: e, tp:this.tempFile, ef: this.endFile});
          }
    }

    async pause(){
        try {
            await this._download.pauseAsync();
            this._savableUpdate();
            this._statusUpdate(DOWNLOAD_STATUS_PAUSED);
          } catch (e) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'pause', error: e, tp:this.tempFile, ef: this.endFile});
          }
    }

    async cancel(){
        try {
            await this._download.pauseAsync();
            await FileSystem.deleteAsync(this.tempFile, { idempotent: true });
            await FileSystem.deleteAsync(filePath + this.id, { idempotent: true });
            if(typeof this.downloadStopCallback === 'function') this.downloadStopCallback();
          } catch (e) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'pause', error: e, tp:this.tempFile, ef: this.endFile});
          }
    }

    async resume(){
        this._statusUpdate(DOWNLOAD_STATUS_DOWNLOADING);
        this._savableUpdate();
        try {
            const { uri } = await this._download.resumeAsync();
            this._rename(uri);
          } catch (e) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'resume', error: e});
          }
    }

    async recover(id = ''){
        if(typeof id !=="string") return;
        try {
            const data = JSON.parse(await FileSystem.readAsStringAsync(filePath + id));
            this.set(data);
            this._download = new FileSystem.DownloadResumable(
                this._savable.url,
                this._savable.fileUri,
                this._savable.options,
                downloadProgress => {
                    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                    this.downloadProgress = progress;
                    if(typeof this.downloadProgressCallback === 'function') this.downloadProgressCallback(progress);
                  },
                  this._savable.resumeData
              );
              this.resume();
        } catch (error) {
            if(typeof this.downloadErrorCallback === 'function') this.downloadErrorCallback({fn:'recover', error: e});
        }
    }
}