const db = require('../db');

exports.criarPedido = (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: 'Usuário não informado.' });
    }

    // 1. Criar pedido
    const sqlPedido = 'INSERT INTO pedidos (usuario_id, data_pedido) VALUES (?, NOW())';
    db.query(sqlPedido, [usuario_id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar pedido.' });

        const pedidoId = result.insertId;

        // 2. Buscar itens do carrinho
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

            // 3. Inserir os itens na tabela pedido_itens
            const sqlItens = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco) VALUES ?';
            const valores = itens.map(item => [pedidoId, item.produto_id, item.quantidade, item.preco]);

            db.query(sqlItens, [valores], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao inserir itens do pedido.' });

                // 4. Esvaziar carrinho
                const sqlLimpar = 'DELETE FROM carrinho WHERE usuario_id = ?';
                db.query(sqlLimpar, [usuario_id], (err) => {
                    if (err) return res.status(500).json({ error: 'Erro ao limpar carrinho.' });

                    res.status(201).json({ message: 'Pedido criado com sucesso!', pedido_id: pedidoId });
                });
            });
        });
    });
};