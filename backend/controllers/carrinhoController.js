const db = require('../db');

//adicionar item ao carrinho
exports.adicionarItem = (req,res)=>{
    const{usuario_id, produto_id, quantidade} = req.body;
    const sql = 'INSERT INTO carrinho (usuario_id, produto_id, quantidade) VALUES(?,?,?)';

    db.query(sql,[usuario_id, produto_id, quantidade], (err,result)=>{
        if(err) return res.status(500).json({error: err.message});

        res.status(201).json({message: 'Item adicionado ao carrinho!', id:result.insertId});
        
    });
};

//listar todos os itens do carrinho do usuário
exports.listarCarrinho = (req,res)=>{
    const {usuario_id} = req.params;

    const sql = 
    `SELECT c.id, c.produto_id, p.nome, p.preco, c.quantidade, (p.preco * c.quantidade) AS subtotal
    FROM carrinho c
    JOIN produtos p ON c.produto_id = p.id
    WHERE c.usuario_id = ? `;

    db.query(sql, [usuario_id], (err,results) =>{
        if(err) return res.status(500).json({error: err.message});

        res.json(results);
    });
};

//atualizar quantidade de um item no carrinho
exports.atualizarQuantidade = (req,res) =>{
    const {id} = req.params;
    const {quantidade} = req.body;

    const sql = 'UPDATE carrinho SET quantidade = ? WHERE id = ?';

    db.query(sql, [quantidade, id],(err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        
        res.json({message: 'Quantidade atualizada com sucesso!'});
    });
};

//remover um item do carrinho
exports.removerItem = (req,res)=>{
    const {id} = req.params;

    db.query('DELETE FROM carrinho WHERE id = ?', [id], (err,result) =>{
        if(err) return res.status(500).json({error: err.message});

        res.json({message: 'Item removido do carrinho!'});
    });
};

//esvaziar o carrinho de um usuário
exports.limparCarrinho = (req,res) =>{
    const {usuario_id} = req.params;

    db.query('DELETE FROM carrinho WHERE usuario_id = ?', [usuario_id], (err, result) =>{
        if(err) return res.status(500).json({error: err.message});

        res.json({message: 'Carrinho esvaziado com sucesso!'});
    });
};

