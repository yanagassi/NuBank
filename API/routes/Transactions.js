const express = require('express');
const router = express.Router();  
const Messages = require("../constants/Messages");
const axios = require('axios');
const Worker = require("../constants/Workers")
const Transactions = require('../models/Transactions');


router.get('/', function(req, res, next) {  
    res.send(JSON.stringify({ status: "sucess" }))
});
 

router.post("/send", function(req,res,next) {
    const data = req.body; 
    if( 
        data.sender   === undefined   || 
        data.receiver === undefined   || 
        data.amount   === undefined   
    ) {res.send(JSON.stringify(Messages.ErroParams)); return;};
    
    axios.post(Worker.nodePrincipal.host +":"+ Worker.nodePrincipal.port + "/transaction",{
        sender:    parseInt(data.sender),
        receiver:  parseInt(data.receiver),
        amount:    parseFloat(data.amount)
    })
    .then(function(res){
        
    })
    res.send(
        JSON.stringify(
            { status: "sucess" }
        )
    )
});

router.post("/response", function(req,res,next) {
    const data = req.body; 
    if( 
        data.sender   === undefined   || 
        data.receiver === undefined   || 
        data.amount   === undefined   ||
        data.index    === undefined   || 
        data.proof    === undefined    
    ) res.send(JSON.stringify(Messages.ErroParams)); 
    Transactions.create([{
        _id:null,
        sender:     parseInt(data.sender),
        receiver:   parseInt(data.receiver),
        amount:     parseFloat(data.amount),
        index:      parseInt(data.index),
        proof:      parseFloat(data.proof),
        status: 1
    }])
    .then(response=> res.send(JSON.stringify({ status: "sucess" })))
    .catch(e=> res.send(JSON.stringify({ status: "error" }))) 
});


module.exports = router;

