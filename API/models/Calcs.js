 
module.exports.calculaTransacao = async (Transactions, accountNumber = null) => {
    if(accountNumber == null) return;
        
    let receiver = null;
    let sender = null;

    await Transactions.find({ receiver: accountNumber }) 
    .then(response=>{
        response.forEach(element => {
            receiver = parseFloat(element.receiver) + parseFloat(receiver);
        });
    }) 
    .catch(e=>{
        console.log(JSON.stringify({status:"error", erro:e}))
    })
    await Transactions.find({ sender: accountNumber }) 
    .then(response=>{
        response.forEach(element => {
            sender = parseFloat(element.sender) + parseFloat(sender);
        });
    }) 
     
    return receiver - sender;
}
 
 
 