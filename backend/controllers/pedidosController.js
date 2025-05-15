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

// Listar Pedidos por Usuário (com detalhes dos itens)
exports.listarPedidosPorUsuario = (req, res) => {
    const { usuario_id } = req.params;

    const sqlPedidos = `
        SELECT p.id AS pedido_id, p.data_pedido, p.status, p.total,
               pi.produto_id, pr.nome AS nome_produto, pi.quantidade, pi.preco
        FROM pedidos p
        JOIN pedido_itens pi ON p.id = pi.pedido_id
        JOIN produtos pr ON pi.produto_id = pr.id
        WHERE p.usuario_id ;
    `;

    db.query(sqlPedidos, [usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Agrupar os itens por pedido
        const pedidos = {};

        results.forEach(row => {
            if (!pedidos[row.pedido_id]) {
                pedidos[row.pedido_id] = {
                    pedido_id: row.pedido_id,
                    data_pedido: row.data_pedido,
                    status: row.status,
                    total: row.total,
                    itens: []
                };
            }

            pedidos[row.pedido_id].itens.push({
                produto_id: row.produto_id,
                nome: row.nome_produto,
                quantidade: row.quantidade,
                preco: row.preco
            });
        });

        res.json(Object.values(pedidos));
    });
};