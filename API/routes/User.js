const express = require('express');
const router = express.Router(); 
const Users = require('../models/Users');
const Accounts = require('../models/Accounts');
const Transactions = require('../models/Transactions'); 
const Messages = require("../constants/Messages");
const {calculaTransacao} = require("../models/Calcs");

router.get('/', function(req, res, next) {  
    res.send(JSON.stringify({ status: "sucess" }))
});
 
router.post('/login', function(req, res, next) {
    const data = req.body;  
    if(data.phone === undefined || data.senha === undefined) res.send(JSON.stringify(Messages.ErroParams));
    Users.find({ phone:data.phone, senha:data.senha }) 
    .then(response=>{ 
        if(response.length > 0){
            const userData =  response[0];  
            Accounts.find({ idUser: userData._id}) 
            .then(async (response)=>{   
                res.send({
                    status: "sucess",
                    data:{
                        userData,
                        saldo:  await calculaTransacao(Transactions, response[0].accountNumber)
                    } 
                })
            });
          
        }
        else{
            res.send(Messages.ErrorUsuario)
        }
    })
    .catch(e=>{
        res.send(Messages.ErroBanco)
    })
})  

router.post('/cadastro', function(req, res, next) {
    const data = req.body; 
    if(data.phone === undefined || data.senha === undefined || data.name === undefined || data.dataNascimento === undefined) res.send(JSON.stringify(Messages.ErroParams));
    Users.find({ phone:data.phone }) 
    .then(response=>{
        if(response.length > 0){
            res.send(Messages.ErrorCadastroEmail);
        }
        else{
            Users.create([{
                _id:null,
                phone: data.phone,
                senha: data.senha,
                name: data.name,
                dataNascimento: new Date(data.dataNascimento) 
            }])
            .then(response=>res.send(Messages.SucessCadastroMessage))
            .catch(e=>res.send(Messages.ErroBanco))
        }
    })
    .catch(e=>{res.send(Messages.ErroBanco);}) 
})
 

module.exports = router;
