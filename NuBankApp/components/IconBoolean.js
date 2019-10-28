import React from 'react'
import * as Icon from '@expo/vector-icons';
import {TouchableOpacity,Platform,View} from 'react-native';
import axios from 'axios';
import Api from '../constants/Api'
import Utils from '../constants/Utils'

export default class IconBoolean extends React.Component{
    constructor(props){
        super(props);
        
        this.state={
            active:false,
            toast_enunciado:'Adicionado com sucesso',
            toast_active:false,
            disabled:false,
        };
    }

    mostraToast(toast_enunciado){
        this.setState({toast_enunciado,toast_active:true})
        setTimeout(()=>{ this.hideToast() }, 3000);
    }

    componentWillMount(){
        axios.request(`${Api.uri}/biblioteca/ler_depois_verify?id_user=${this.props.id_user}&id_pocket=${this.props.id_pocket}`)
            .then((r)=>{
                this.setState({active:r.data.exists})
            })
    }

    hideToast(){
        this.setState({toast_active:false})
    }

    appendIn(id_pocket,id_user){
        this.setState({disabled:true})
        
        axios.post(`${Api.uri}/biblioteca/ler_depois`,Utils.getFormData({ id_pocket,  id_user}), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then((v)=>{
            if(v.data.status=='success'){
                //this.mostraToast('PocketBook adicionado à sua lista de Ler Depois')
                this.setState({active:true,disabled:false})
            }else{
                this.setState({disabled:false})
                //this.mostraToast('Ops, houve um erro ao adicionar seu PocketBook na sua lista de Ler Depois, tente novamente mais tarde')
            }
           
        })
        .catch(()=>{
            this.setState({disabled:false})
        })
    }

    removeIn(id_pocket,id_user){
        this.setState({disabled:true})
        axios.post(`${Api.uri}/biblioteca/ler_depois_delete`,Utils.getFormData({ id_pocket,  id_user}), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then((v)=>{
            if(v.data.status=='success'){
                //this.mostraToast('PocketBook removido da sua lista de Ler Depois')
                this.setState({active:false,disabled:false})
            }else{
                this.setState({disabled:false})
                //this.mostraToast('Ops, houve um erro ao remover seu PocketBook na sua lista de Ler Depois, tente novamente mais tarde')
            }
        })
        .catch(()=>{
            this.setState({disabled:false})
        })
    }

    render(){
        return(
            (this.state.disabled)
            ?<View>
                <Icon.Ionicons name={Platform.select({ios: "ios-time", android: 'md-time'})} size={(this.props.sizeIcon==undefined)?24:this.props.sizeIcon} color={'black'} />
            </View>
            :<TouchableOpacity onPress={()=>{(this.state.active)?this.removeIn(this.props.id_pocket,this.props.id_user):this.appendIn(this.props.id_pocket,this.props.id_user)}}>
                <Icon.Ionicons name={Platform.select({ios: "ios-bookmark", android: 'md-bookmark'})} size={(this.props.sizeIcon==undefined)?24:this.props.sizeIcon} color={(this.state.active)?'black':'grey'} />
                {/* <Toast
                    visible={this.state.toast_active}
                    position={50}
                    shadow={true}
                    animation={true}
                    hideOnPress={true}
                > 
                {this.state.toast_enunciado}
                </Toast>*/}
            </TouchableOpacity>
        )
    }
}