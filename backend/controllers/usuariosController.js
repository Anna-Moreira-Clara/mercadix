const db = require('../db');

//criar um novo usuário
exports.criarUsuario = (req,res) =>{
    const{nome, cpf, email, senha, endereco, telefone, role} = req.body;
    const sql = 'INSERT INTO usuarios (nome, cpf, email, senha, endereco, telefone,role)VALUES(?,?,?,?,?,?,?)';

    db.query(sql, [nome, cpf, email, senha, endereco, telefone, role], (err,result)=>{
        if
    })
}
