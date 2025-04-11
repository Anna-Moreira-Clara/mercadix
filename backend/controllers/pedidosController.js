const db = require('../db'); //conexão com o banco de dados

const criarPedido = (req,res)=>{
    const{usuario_id} = req.body;

    if(!usuario_id){
        return res.status(400)
    }
}