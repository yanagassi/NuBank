export default class Model {
    genID(size = 9){
        let p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let f = p.substr(Math.floor(Math.random()*p.length), 1);
        size = Math.min(Math.max(9, size), 27);
        return f + Math.random().toString(36).substr(2, size);
    }

    constructor(object = {}, key = '') {
        if(typeof key !== 'string' || key.length==0){
            this.set(object);
        } else {
            this.set(object, key);
        }
    }

    setObject(object = {}, key = ''){
        if(typeof object !== 'object' && (typeof key !== 'string' || key.length==0)) return;
        for (const _key in object) {
            if (object.hasOwnProperty(_key)) {
                if(object[_key]!=null && object[_key]!=undefined) {
                    this[key][_key] = object[_key];
                }
            }
        }
    }

    set(object = {}, key = ''){
        if(typeof object !== 'object' && (typeof key !== 'string' || key.length==0)) return;
        if(typeof object !== 'object'){
            this[key] = object;
        } else {
            for (const _key in object) {
                if (object.hasOwnProperty(_key)) {
                    if(object[_key]!=null && object[_key]!=undefined) {
                        if(typeof this[_key]=='object'){
                            this.setObject(object[_key], _key);
                        } else {
                            this[_key] = object[_key];
                        }
                    }
                }
            }
        }
    }

    toJSON(){
        let out = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if(typeof this[key] !== 'function') out[key] = this[key];
            }
        }
        return out;
    };
}