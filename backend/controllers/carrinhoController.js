const db = require('../db');

// adicionar item ao carrinho
exports.adicionarItem = (req, res) => {
    const { usuario_id, produto_id, quantidade } = req.body;

    const verificarSQL = 'SELECT * FROM carrinho WHERE usuario_id = ? AND produto_id = ?';
    db.query(verificarSQL, [usuario_id, produto_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const novaQuantidade = results[0].quantidade + quantidade;
            const updateSQL = 'UPDATE carrinho SET quantidade = ? WHERE id = ?';
            db.query(updateSQL, [novaQuantidade, results[0].id], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                return res.json({ message: 'Quantidade atualizada no carrinho!' });
            });
        } else {
            const insertSQL = 'INSERT INTO carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)';
            db.query(insertSQL, [usuario_id, produto_id, quantidade], (err3, result) => {
                if (err3) return res.status(500).json({ error: err3.message });
                return res.status(201).json({ message: 'Item adicionado ao carrinho!', id: result.insertId });
            });
        }
    });
};

// listar itens do carrinho
exports.listarCarrinho = (req, res) => {
    const { usuario_id } = req.params;

    const sql = `
        SELECT c.id, c.produto_id, p.nome, p.preco, c.quantidade, (p.preco * c.quantidade) AS subtotal
        FROM carrinho c
        JOIN produtos p ON c.produto_id = p.id
        WHERE c.usuario_id = ?
    `;

    db.query(sql, [usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// atualizar quantidade de um item do carrinho (usando ID do item no carrinho)
exports.atualizarQuantidade = (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    const sql = 'UPDATE carrinho SET quantidade = ? WHERE id = ?';
    db.query(sql, [quantidade, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Quantidade atualizada com sucesso!' });
    });
};

// remover item
exports.removerItem = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM carrinho WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removido do carrinho!' });
    });
};

// limpar carrinho
exports.limparCarrinho = (req, res) => {
    const { usuario_id } = req.params;

    db.query('DELETE FROM carrinho WHERE usuario_id = ?', [usuario_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Carrinho esvaziado com sucesso!' });
    });
};

// finalizar compra
exports.finalizarCompra = (req, res) => {
    const { usuario_id, itens } = req.body;

    if (!itens || itens.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio.' });
    }

    const criarPedidoSQL = 'INSERT INTO pedidos (usuario_id, total, status, data_pedido) VALUES (?, 0, "pendente", NOW())';

    db.query(criarPedidoSQL, [usuario_id], (err, pedidoResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const pedido_id = pedidoResult.insertId;
        const valores = itens.map(item => [pedido_id, item.produto_id, item.quantidade, item.preco]);

        const inserirItensSQL = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco) VALUES ?';

        db.query(inserirItensSQL, [valores], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            db.query('DELETE FROM carrinho WHERE usuario_id = ?', [usuario_id], (err3) => {
                if (err3) return res.status(500).json({ error: err3.message });

                res.json({ message: 'Compra finalizada com sucesso!', pedido_id });
            });
        });
    });
};
