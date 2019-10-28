const mongoose = require("../constants/DB_Config"); 

const UserModel = mongoose.Schema(
    {
        _id:String,
        name:String,
        email:String,
        senha:String,
        dataNascimento: Date,
    },
    {
        collection: "Users"
    }
);
module.exports = mongoose.model('Users',UserModel); 