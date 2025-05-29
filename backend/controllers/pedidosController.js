const db = require('../db');

// Criar Pedido - ATUALIZADO COM CONTROLE DE ESTOQUE
exports.criarPedido = (req, res) => {
    const { usuario_id, endereco } = req.body;

    if (!usuario_id || !endereco) {
        return res.status(400).json({ error: 'Usuário não informado.' });
    }

    const sqlPedido = 'INSERT INTO pedidos (usuario_id, endereco, data_pedido, status) VALUES (?, ?, NOW(), "pendente")';
    db.query(sqlPedido, [usuario_id, endereco], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar pedido.' });

        const pedidoId = result.insertId;

        const sqlCarrinho = `
            SELECT c.produto_id, c.quantidade, p.preco, p.nome, p.estoque
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = ?
        `;
        db.query(sqlCarrinho, [usuario_id], (err, itens) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar itens do carrinho.' });

            if (itens.length === 0) {
                return res.status(400).json({ error: 'Carrinho vazio.' });
            }

            // VALIDAÇÃO DE ESTOQUE - Verifica se há estoque suficiente para todos os itens
            const itensInsuficientes = itens.filter(item => item.quantidade > item.estoque);
            
            if (itensInsuficientes.length > 0) {
                const nomesProdutos = itensInsuficientes.map(item => `${item.nome} (solicitado: ${item.quantidade}, disponível: ${item.estoque})`);
                return res.status(400).json({ 
                    error: 'Estoque insuficiente para os seguintes produtos:', 
                    produtos: nomesProdutos 
                });
            }

            // Se chegou até aqui, há estoque suficiente para todos os itens
            const sqlItens = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco) VALUES ?';
            const valores = itens.map(item => [pedidoId, item.produto_id, item.quantidade, item.preco]);

            db.query(sqlItens, [valores], (err) => {
                if (err) {
                    console.error('Erro ao inserir itens do pedido:', err);
                    return res.status(500).json({ error: 'Erro ao inserir itens do pedido.' });
                }

                // Calcula o total do pedido
                const total = itens.reduce((soma, item) => soma + (item.quantidade * parseFloat(item.preco)), 0);

                // Atualiza o total no pedido
                const sqlAtualizarTotal = 'UPDATE pedidos SET total = ? WHERE id = ?';
                db.query(sqlAtualizarTotal, [total, pedidoId], (err) => {
                    if (err) {
                        console.error('Erro ao atualizar total do pedido:', err);
                        return res.status(500).json({ error: 'Erro ao atualizar total do pedido.' });
                    }

                    // NOVA FUNCIONALIDADE: Atualiza o estoque dos produtos
                    let estoqueAtualizadoCount = 0;
                    let erroEstoque = false;

                    itens.forEach((item, index) => {
                        const novoEstoque = item.estoque - item.quantidade;
                        const sqlAtualizarEstoque = 'UPDATE produtos SET estoque = ? WHERE id = ?';
                        
                        db.query(sqlAtualizarEstoque, [novoEstoque, item.produto_id], (err) => {
                            if (err) {
                                console.error(`Erro ao atualizar estoque do produto ${item.produto_id}:`, err);
                                erroEstoque = true;
                            }
                            
                            estoqueAtualizadoCount++;
                            
                            // Quando todos os estoques foram processados
                            if (estoqueAtualizadoCount === itens.length) {
                                if (erroEstoque) {
                                    return res.status(500).json({ error: 'Erro ao atualizar estoque dos produtos.' });
                                }
                                
                                // Limpa o carrinho do usuário
                                const sqlLimpar = 'DELETE FROM carrinho WHERE usuario_id = ?';
                                db.query(sqlLimpar, [usuario_id], (err) => {
                                    if (err) {
                                        console.error('Erro ao limpar carrinho:', err);
                                        return res.status(500).json({ error: 'Erro ao limpar carrinho.' });
                                    }

                                    // Resposta de sucesso
                                    res.status(201).json({ 
                                        message: 'Pedido criado com sucesso! Estoque atualizado.',
                                        pedido_id: pedidoId,
                                        total: total,
                                        status: 'pendente'
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};

// Listar Pedidos por Usuário (com detalhes dos itens)
exports.listarPedidosPorUsuario = (req, res) => {
    const { usuario_id } = req.params;

    const sqlPedidos = `
        SELECT p.id AS pedido_id, p.data_pedido, p.status, p.total, p.endereco,
               pi.produto_id, pr.nome AS nome_produto, pi.quantidade, pi.preco
        FROM pedidos p
        JOIN pedido_itens pi ON p.id = pi.pedido_id
        JOIN produtos pr ON pi.produto_id = pr.id
        WHERE p.usuario_id = ?
        ORDER BY p.id DESC
    `;

    db.query(sqlPedidos, [usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const pedidos = {};

        results.forEach(row => {
            if (!pedidos[row.pedido_id]) {
                pedidos[row.pedido_id] = {
                    pedido_id: row.pedido_id,
                    data_pedido: row.data_pedido,
                    status: row.status,
                    total: parseFloat(row.total || 0),
                    endereco: row.endereco,
                    itens: []
                };
            }

            pedidos[row.pedido_id].itens.push({
                produto_id: row.produto_id,
                nome: row.nome_produto,
                quantidade: row.quantidade,
                preco: parseFloat(row.preco || 0)
            });
        });

        res.json(Object.values(pedidos));
    });
};

// Listar todos os pedidos
exports.listarTodosPedidos = (req, res) => {
    const sql = `
        SELECT 
            p.id AS pedido_id, p.data_pedido, p.status, p.total, p.endereco, 
            u.id AS usuario_id, u.nome AS nome_usuario,
            pi.produto_id, pr.nome AS nome_produto, pi.quantidade, pi.preco
        FROM pedidos p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN pedido_itens pi ON p.id = pi.pedido_id
        LEFT JOIN produtos pr ON pi.produto_id = pr.id
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const pedidos = {};

        results.forEach(row => {
            if (!pedidos[row.pedido_id]) {
                pedidos[row.pedido_id] = {
                    pedido_id: row.pedido_id,
                    data_pedido: row.data_pedido,
                    status: row.status,
                    total: parseFloat(row.total || 0),
                    endereco: row.endereco,
                    usuario_id: row.usuario_id,
                    nome_usuario: row.nome_usuario,
                    itens: []
                };
            }

            if (row.produto_id) {
                pedidos[row.pedido_id].itens.push({
                    produto_id: row.produto_id,
                    nome_produto: row.nome_produto,
                    quantidade: row.quantidade,
                    preco: row.preco
                });
            }
        });

        res.json(Object.values(pedidos));
    });
};

// NOVA FUNCIONALIDADE: Cancelar pedido e devolver estoque
exports.cancelarPedido = (req, res) => {
    const { id } = req.params;

    // Primeiro, busca os itens do pedido para devolver ao estoque
    const sqlBuscarItens = `
        SELECT pi.produto_id, pi.quantidade, p.status
        FROM pedido_itens pi
        JOIN pedidos p ON pi.pedido_id = p.id
        WHERE pi.pedido_id = ?
    `;

    db.query(sqlBuscarItens, [id], (err, itens) => {
        if (err) {
            console.error('Erro ao buscar itens do pedido:', err);
            return res.status(500).json({ error: 'Erro ao buscar itens do pedido.' });
        }

        if (itens.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        // Verifica se o pedido já foi finalizado
        if (itens[0].status === 'finalizado') {
            return res.status(400).json({ error: 'Não é possível cancelar um pedido já finalizado.' });
        }

        if (itens[0].status === 'cancelado') {
            return res.status(400).json({ error: 'Este pedido já foi cancelado.' });
        }

        // Devolve o estoque dos produtos
        let estoqueDevolvido = 0;
        let erroEstoque = false;

        itens.forEach((item) => {
            const sqlDevolverEstoque = 'UPDATE produtos SET estoque = estoque + ? WHERE id = ?';
            
            db.query(sqlDevolverEstoque, [item.quantidade, item.produto_id], (err) => {
                if (err) {
                    console.error(`Erro ao devolver estoque do produto ${item.produto_id}:`, err);
                    erroEstoque = true;
                }
                
                estoqueDevolvido++;
                
                // Quando todos os estoques foram devolvidos
                if (estoqueDevolvido === itens.length) {
                    if (erroEstoque) {
                        return res.status(500).json({ error: 'Erro ao devolver estoque dos produtos.' });
                    }
                    
                    // Atualiza o status do pedido para cancelado
                    const sqlCancelar = 'UPDATE pedidos SET status = "cancelado" WHERE id = ?';
                    db.query(sqlCancelar, [id], (err, result) => {
                        if (err) {
                            console.error('Erro ao cancelar pedido:', err);
                            return res.status(500).json({ error: 'Erro ao cancelar pedido.' });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({ error: 'Pedido não encontrado.' });
                        }

                        res.json({ 
                            success: true, 
                            message: 'Pedido cancelado com sucesso! Estoque devolvido.' 
                        });
                    });
                }
            });
        });
    });
};

// Atualizar status do pedido
exports.atualizarStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Tentando atualizar pedido ${id} para status: ${status}`);

    // Status permitidos
    const statusPermitidos = ['pendente', 'finalizado', 'cancelado'];
    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ error: `Status inválido. Status permitidos: ${statusPermitidos.join(', ')}` });
    }

    // Se o status for cancelado, usar a função de cancelar pedido
    if (status === 'cancelado') {
        return exports.cancelarPedido(req, res);
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Erro no banco ao atualizar status:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o status do pedido.' });
        }

        console.log('Resultado da query:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.json({ success: true, message: 'Status do pedido atualizado com sucesso!' });
    });
};