const db = require('../db');

// Criar Pedido
exports.criarPedido = (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: 'Usuário não informado.' });
    }

    const sqlPedido = 'INSERT INTO pedidos (usuario_id, data_pedido) VALUES (?, NOW())';
    db.query(sqlPedido, [usuario_id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar pedido.' });

        const pedidoId = result.insertId;

        const sqlCarrinho = `
            SELECT c.produto_id, c.quantidade, p.preco
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = ?
        `;
        db.query(sqlCarrinho, [usuario_id], (err, itens) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar itens do carrinho.' });

            if (itens.length === 0) {
                return res.status(400).json({ error: 'Carrinho vazio.' });
            }

            const sqlItens = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco) VALUES ?';
            const valores = itens.map(item => [pedidoId, item.produto_id, item.quantidade, item.preco]);

            db.query(sqlItens, [valores], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao inserir itens do pedido.' });

                const sqlLimpar = 'DELETE FROM carrinho WHERE usuario_id = ?';
                db.query(sqlLimpar, [usuario_id], (err) => {
                    if (err) return res.status(500).json({ error: 'Erro ao limpar carrinho.' });

                    res.status(201).json({ message: 'Pedido criado com sucesso!', pedido_id: pedidoId });
                });
            });
        });
    });
};

// Listar Pedidos por Usuário
exports.listarPedidosPorUsuario = (req, res) => {
    const { usuario_id } = req.params;

    const sql = `
        SELECT p.id AS pedido_id, p.total, p.status, p.data_pedido
        FROM pedidos p
        WHERE p.usuario_id = ?
        ORDER BY p.data_pedido DESC
    `;

    db.query(sql, [usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao listar pedidos' });

        res.json(results);
    });
};
