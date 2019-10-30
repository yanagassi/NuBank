const mongoose = require('mongoose');
 
const stringConnect =  "mongodb://localhost/nubank";
mongoose.connect(stringConnect).then(
  ()=>{},
  err =>{console.log("Erro na conexão com o banco de dados !",err);}
);

module.exports = mongoose 