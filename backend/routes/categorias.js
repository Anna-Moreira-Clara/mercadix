const express = require('express');
const router = express.Router();
const db = require('../db');

//criar categoria
router.post('/',(req,res)=>{
    const{nome} = req.body;
    const sql = 'INSERT INTO categorias (nome) VALUES(?)';

    db.query(sql,[nome], (err, result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.status(201).json({message: 'Categoria Criada!', id: result.insertId});

    });
});

//listar categorias
router.get('/',(req,res)=>{
    db.query('SELECT * FROM categorias', (err, results)=>{
        if(err) return res.status(500).json({error: err.message});
    });
});

//buscar categorias por id
router.get('/:id',(req,res) =>{
    db.query('SELECT * FROM categorias WHERE id = ?',[req.params.id], (err, result)=>{
        if(err) return res.status(500).json({error:err.message});
        if(result.length===0) return res.status(404).json({error:'Categoria não encontrada'});
        res.json(result[0]);

    });

});

//atualizar categoria
router.put('/:id', (req,res)=>{
    const {nome} = req.body;
    const sql = 'UPDATE categorias SET nome = ? WHERE id = ?';

    db.query(sql,[nome,req.params.id], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        React.json({message: 'Categoria Atualizada com Sucesso!'});
    });
});

//delete categoria
route.delete('/:id', (req,res)=>{
    db.query('DELETE FROM categorias WHERE id =?',[req.params.id], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'Categoria Excluída com Sucesso'});
    });
});

module.exports = router;