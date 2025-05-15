// routes/pedidos.js
const express = require('express');
const router = express.Router();

<<<<<<< HEAD
//rota para criar novo pedido
router.post('/', pedidosController.criarPedido);
router.get('/:usuario_id', pedidosController.listarPedidosPorUsuario);
=======
router.get('/', async (req, res) => {
  try {
    const [pedidos] = await db.execute(`
      SELECT 
        p.id, p.data_pedido, p.status, p.total,
        u.nome AS nome_usuario
      FROM pedidos p
      JOIN usuarios u ON u.id = p.usuario_id;
    `);

    // Para cada pedido, buscar os itens
    for (const pedido of pedidos) {
      const [itens] = await db.execute(`
        SELECT 
          pi.quantidade, pi.preco,
          pr.nome AS nome_produto
        FROM pedido_itens pi
        JOIN produtos pr ON pr.id = pi.produto_id
        WHERE pi.pedido_id = ?
      `, [pedido.id]);

      // Mapeia os itens do pedido
      pedido.itens = itens.map(item => ({
        quantidade: item.quantidade,
        preco: item.preco,
        produto: {
          nome: item.nome_produto
        }
      }));

      // Atribui o nome do usuário
      pedido.usuario = {
        nome: pedido.nome_usuario
      };

      // Define valores padrão para frete e total
      pedido.valor_frete = 0;
      pedido.valor_total = pedido.total ?? 0;
    }

    // Retorna os pedidos com os itens detalhados
    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;
>>>>>>> 614fd73704a4a81ac327ec48b94dc8ef853c8a3e
