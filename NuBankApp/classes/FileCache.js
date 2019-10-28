import * as FileSystem from 'expo-file-system';

export default class FileCache {
    constructor () {

    }
    
    get(ref = '') {
        return new Promise((resolve, reject)=>{
            if(typeof ref !== 'string') reject("The 'ref' type must be an url string.");
            let filename = ref.split('/').join('.');
            FileSystem.getInfoAsync(FileSystem.cacheDirectory + filename).then((r)=>{
                if(r.exists==true){
                    resolve(r.uri);
                } else {
                    this._download(ref, filename);
                    resolve(url);
                }
            }).catch(err2=>reject(err));
        });
    }

    getImage(ref = '') {
        return new Promise((resolve, reject)=>{
            if(typeof ref !== 'string') reject("The 'ref' type must be an url string.");
            let filename = ref.split('/').join('.');
            FileSystem.getInfoAsync(FileSystem.cacheDirectory + filename).then((r)=>{
                if(r.exists==true){
                    resolve({uri: r.uri});
                } else {
                    this._download(ref, filename);
                    resolve({uri: ref});
                }
            }).catch(err2=>reject(err));
        });
    }

    async _download(url = null, filename = null){
        if(url==null || filename == null) return;
        return FileSystem.downloadAsync(
            url,
            FileSystem.cacheDirectory + filename
        );
    }
}