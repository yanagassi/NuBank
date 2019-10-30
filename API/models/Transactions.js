const mongoose = require("../constants/DB_Config"); 

const UserModel = mongoose.Schema(
    {
        _id:String,
        sender:Number,
        receiver:Number,
        amount:Number,
        index: Number,
        proof: Number,
    },
    {
        collection: "transactions"
    }
);
module.exports = mongoose.model('transactions',UserModel); 