const db = require('../db'); //conexão com o banco de dados


//criar novo pedido
const criarPedido = (req, res) => {
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: 'Usuário é obrigatório' });

    }
    const sql = 'INSERT INTO pedidos(usuario_id, total, status, data_pedido) VALUES (?, 0, "pendente", NOW()';
    db.query(sql, [usuario_id], (err, result) => {
        if (err) {
            console.error('Erro ao criar pedido: ', err);
            return res.status(500).json({ error: 'Erro ao criar pedido' });
        }
        const pedidoId = result.insertId;
        res.status(201).json({
            message: 'Pedido criado com sucesso!',
            pedido_id: pedidoId
        });
    });
};

 module.exports = {
    criarPedido
};