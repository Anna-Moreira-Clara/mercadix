const express = require('express'); 
const router = express.Router();// Cria um roteador para gerenciar todas as rotas relacionadas a usuários.
const db = require('../db');// Importa a conexão com o banco de dados para executar comandos SQL.

//Criar rota para usuário

//Rota Inserir Usuário
router.post ('/', (req,res)=>{ 
    const {nome, cpf, email, senha, endereco, telefone, role} = req.body;//recebe os dados do usuário no corpo da requisição
    const sql = 'INSERT into usuarios(nome, cpf, email, senha, endereco, telefone, role ) values (?,?,?,?,?,?,?)';

    db.query(sql,[nome,cpf,email,senha,endereco, telefone,role || 'cliente'], (err, result)=>{ //se o usuário não informar um role, ele será "cliente" por padrão
        if(err) return res.status(500).json({error: err.message});
        res.status(201).json({message: 'Usuário cadastrado com sucesso!'});
    });
});

//Rota Listar Usuário
router.get('/', (req,res)=>{
    db.query('SELECT id, nome,cpf, email, senha, endereco, telefone, role FROM usuarios', (err, results)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(results);
    });
});

//Rota Atualizar Usuário
router.put('/:id',(req,res)=>{
    const {nome, cpf, email, senha, endereco, telefone, role} = req.body;
    const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ?, cpf = ?, endereco = ?, role = ? WHERE id = ?';

    db.query(sql, [nome, cpf, email, senha, endereco, telefone, role, req.params.id], (err, result)=>{ 
        //req.params.id: Captura o ID do usuário pela URL.
        if (err) return res.status(500).json({error:err.message});
        res.json({message: 'Usuário Atualizado!'});
    });
});

//Rota Apagar 
router.delete('/:id', (req,res)=>{
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id],(err,result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'Usuário Removido!'});
    });
});

//exportar as rotas
module.exports = router;


