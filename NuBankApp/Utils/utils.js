import Axios from 'axios'
import moment from 'moment'

export const valid_img = (img)=>{ 
    if(img.indexOf('http') <= -1){
        img=  "http://192.168.1.4" + img;
    }
    return img
}



export const format_data = (data) => {
    if(data == null){ return "Sem data definida !";}
    var d = new Date(data.replace(" ", "T")); 
    return d.getDate() + "/" + (parseInt(d.getMonth()) +1) + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes();
}

export const encurta_nome = (nome)=>{ 
    let nomes = nome.split(" "); 
    return nomes[0] + " " + nomes[1];
}

export const buscaCep = async (cep) => {
    var response = {
        "cep": cep,
        "bairro": "",
        "cidade": "",
        "logradouro": "", 
        "estado_info": {},
        "cidade_info": {}, 
        "estado": ""
    } 

    await Axios.get(`https://api.postmon.com.br/v1/cep/${cep}`)
    .then( res => { response = res.data })
    .catch( err => { 
        resonse = {
            "cep": cep,
            "bairro": "",
            "cidade": "",
            "logradouro": "", 
            "estado_info": {},
            "cidade_info": {}, 
            "estado": ""
        } 
    })

    return response
}

export const formatDate = (str,format = 'DD/MM/YYYY') => {
    var dia,mes,ano,date = ''
    
    str = str.replace(/[^\w\s]/gi,'').replace(/\D+/g, '');
   
    dia = str.substr(0,2)
    mes = str.substr(2,2)
    ano = str.substr(4,4)

    date = `${dia}${mes ? '/'+ mes : ''}${ano ? '/'+ano:''}`

    return date

}