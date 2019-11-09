 
module.exports.calculaTransacao = async (Transactions, accountNumber = null) => {
  
    if(accountNumber == null) return;
        
    let receiver = 0;
    let sender = 0;

    await Transactions.find({ receiver: accountNumber }) 
    .then(response=>{ 
        response.forEach(element => { 
            receiver = parseFloat(element.amount) + parseFloat(receiver);
        });
    }) 
    .catch(e=>{
        console.log(JSON.stringify({status:"error", erro:e}))
    })
    await Transactions.find({ sender: accountNumber }) 
    .then(response=>{
        response.forEach(element => {  
            sender = parseFloat(element.amount) + parseFloat(sender);
        });
    })  
    return parseFloat((receiver - sender).toFixed(2));
}
 
 
 