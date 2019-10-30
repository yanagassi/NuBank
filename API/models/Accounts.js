const mongoose = require("../constants/DB_Config"); 

const UserModel = mongoose.Schema(
    {
        _id:String,
        idUser:String,
        accountNumber:Number,
        agency:Number, 
    },
    {
        collection: "accounts"
    }
);
module.exports = mongoose.model('accounts',UserModel); 