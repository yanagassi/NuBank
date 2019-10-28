import { NetInfo, AsyncStorage} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Utils from '../constants/Utils';

export default class Storage {
    _netListener = null;
    _netState = false;
    _store = {
        offrequests: {}
    };
    _session = {

    };
    _watchers = {};
    permission = false
    constructor () {
        NetInfo.isConnected.fetch().then(isConnected => {
            this._netState = isConnected;
        });
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            this._netState = (connectionInfo.type=='none' || connectionInfo.type=='unknown')? false: true;
            if(this._netState==true){
                this.updateOfflineRequests();
            }
        });
        this._getPermissions();
        this._retrieveData();
    }

    async _getPermissions(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.permission = status === 'granted';
    }   

    _retrieveData = async () => {
        const value = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'store');
        try {
          if (value !== null) {
            this._store = JSON.parse(value);
            for (const key in this._watchers) {
                if (this._watchers.hasOwnProperty(key)) {
                    if(typeof this._watchers[key] === "function") this._watchers[key](this.get_offline(key));                    
                }
            }
          }
         } catch (error) {
             this._save();
            console.info('_retrieveData.error', error);
         }
      }

    updateOfflineRequests(){
        for (const ref in this._store.offrequests) {
            if (this._store.offrequests.hasOwnProperty(ref)) {
                const request = this._store.offrequests[ref];
                this.request(
                    request.url, 
                    request.ref, 
                    request.method,
                    request.params,
                    request.header
                );
                this._store.offrequests = this._store.offrequests.filter((it, _ref)=>_ref!==ref);
            }
        }
        this._save();
    }

    async _save() {
        try {
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'store', JSON.stringify(this._store));
        } catch (error) {
            console.info('_save.error', error);
        }
    }

    request(url = '', ref = '', method = 'GET', params = {}, header = {}){
        if(typeof url !== "string") throw "";
        if(url.length === 0) throw "";
        if(typeof ref !== "string") throw "";
        if(ref.length === 0) ref = url.split('/').join('_').split(':').join('__').split('?').join('___').split('&').join('____');
        if(this._netState==true){
            switch (method.toLocaleLowerCase()) {
                case 'get':
                    return new Promise((resolve, reject)=>{
                        axios.get(url, Utils.getFormData(params), {headers: {'Content-Type': 'application/x-www-form-urlencoded',...header}})
                        .then(res => {
                            if(ref!==null) this.set(ref, res.data);
                            resolve(res.data);
                        }).catch(e=>{
                            console.log(e);
                            reject(e);
                        });
                    });
                break;
                case 'post':
                    return new Promise((resolve, reject)=>{
                        axios.post(url, Utils.getFormData(params), {headers: {'Content-Type': 'application/x-www-form-urlencoded',...header}})
                        .then(res => {
                            if(ref!==null) this.set(ref, res.data);
                            resolve(res.data);
                        }).catch(e=>{
                            console.log(e);
                            reject(e);
                        });
                    });
                break;
            }
        } else {
            if(ref!==null){
                this._store.offrequests[ref] = {url, ref, method, params, header};
                this._save();
                return this.get(ref);
            }
            return new Promise((resolve, reject)=>{
                reject("Sem internet e sem suporte offline.");
            });
        }
    }

    async watch(ref = '', handler = ()=>{}) {
        let _ref = ref.split('/').join('.');
        this._watchers[_ref] = handler;
        if(typeof handler === "function") handler(this.get_offline(ref));
    }

    unwatch(ref = ''){
        let _ref = ref.split('/').join('.');
        this._watchers = this._watchers.filter((a, i)=>i!==_ref);
        return true;
    }

    get_offline(ref = '') {
        let _ref = ref.split('/');
        let out = this._store;
        for (let index = 0; index < _ref.length; index++) {
            if(_ref[index]=='') continue;
            let _o = out[_ref[index]];
            if(_o==undefined) {
                out = null;
                break;
            }
            out = _o;
        }
        return out;
    }

    get(ref = '', forceRemoteSearch = false) {
        return new Promise((resolve, reject)=>{
            if(typeof ref !== 'string') reject("The 'ref' type must be string.");
            let v = this.get_offline(ref);
            if(v==null) return reject("Does not exist.");
            return resolve(v);
        });
    }

    setToValue(obj, value, path) {
        var i;
        path = path.split('.');
        for (i = 0; i < path.length - 1; i++){
            if(obj[path[i]]==undefined) obj[path[i]] = {};
            obj = obj[path[i]];
        }
        if(value==null){
            delete obj[path[i]];
        } else {
            obj[path[i]] = value;
        }
    }

    set_offline(ref = '', value = null) {
        let _ref = ref.split('/').join('.');
        try {
            this.setToValue(this._store, value, _ref);
            this._save();
            return true;
        } catch (error) {
            console.info('set_offline.error', error);
            return error;
        }
    }

    set(ref = '', value = null) {
        return new Promise((resolve, reject)=>{
            if(typeof ref !== 'string') reject("The 'ref' type must be string.");
            this.set_offline(ref, value);
            if(typeof this._watchers[ref] === "function") this._watchers[ref](value);
        });
    }
}