const express = require('express');
const router = express.Router(); //cria um grupo de rotas para produtos.
const db = require('../db'); //importa a conexão com o banco de dados.


//Criar Produto
router.post('/',(req,res)=>{
    const {nome, descricao,preco, estoque, imagem, categoria_id} = req.body;
    const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria_id, data_cadastro) VALUES(?,?,?,?,?,?, NOW())'; //NOW() salva a data automaticamente.

    db.query(sql, [nome,descricao,preco,estoque,imagem,categoria_id],(err,result)=>{
        if(err) return res.status(500).json({error:err.message}); //se der erro, vai retornar 500 com o err.mesage
        res.status(201).json({message: 'Produto cadastrado!', id: result.insertId}); //se der certo vai retornar 201 com o id do novo produto
    });
});

//listar Produto
router.get('/',(req, res)=>{
    db.query('SELECT*FROM produtos', (err,results)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(results);
    });
});
//buscar produto pelo id
router.get('/:id',(req,res)=>{
    db.query('SELECT * FROM produtos WHERE id = ?', [req.params.id], (err,result)=>{
        if(err) return res.status(500).json({error: err.message});
        if(result.length === 0) return res.status(404).json({error: 'Produto não encontrado'});
        res.json(result[0]);
    });
});


//atualizar produto
router.put('/:id',(req,res)=>{
    const {nome,descricao,preco,estoque,imagem,categoria_id} = req.body;
    const sql = 'UPDATE produtos SET nome = ?, descricao =?, estoque = ?, imagem= ?, categoria_id =? WHERE id = ?';

    db.query(sql, [nome, descricao, preco, estoque, imagem, categoria_id, req.params.id], (err,result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'Produto atualizado!'});
    });
});

//deletar um produto
router.delete('/:id',(req, res)=>{
    db.query('DELETE FROM produtos WHERE id = ?',[req.params.id],(err, result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.json({message: 'Produto Excluído com Sucesso!'});
    });
});
module.exports = router;