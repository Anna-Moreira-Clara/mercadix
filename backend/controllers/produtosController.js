// controllers/produtosController.js

/* Resumo do que esse controller faz:
   Esse arquivo centraliza toda a lógica de manipulação dos dados de produtos: 
   criar, listar, buscar por ID, atualizar e excluir. Ele deixa o código mais organizado e modular, 
   já que as rotas (em routes/produtos.js) só se preocupam com direcionar as requisições para o método correto do controller.
*/

// Importa a conexão com o banco de dados
const db = require('../db');

// Cria um novo produto
exports.criarProduto = (req, res) => {
  const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

  const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria_id, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, NOW())';

  db.query(sql, [nome, descricao, preco, estoque, imagem, categoria_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const novoId = result.insertId;

    db.query('SELECT * FROM produtos WHERE id = ?', [novoId], (err2, result2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(201).json({ message: 'Produto cadastrado!', produto: result2[0] });
    });
  });
};

// Lista todos os produtos
exports.listarProdutos = (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

// Busca um produto pelo ID
exports.buscarProdutoPorId = (req, res) => {
  db.query('SELECT * FROM produtos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result[0]);
  });
};

// Atualiza um produto
exports.atualizarProduto = (req, res) => {
  const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

  const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, imagem = ?, categoria_id = ? WHERE id = ?';

  db.query(sql, [nome, descricao, preco, estoque, imagem, categoria_id, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Produto atualizado!' });
  });
};

// Deleta um produto
exports.deletarProduto = (req, res) => {
  db.query('DELETE FROM produtos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Produto excluído com sucesso!' });
  });
};

// Busca produtos por categoria_id
exports.buscarProdutosPorCategoria = (req, res) => {
  const categoriaId = req.params.categoriaId;

  db.query('SELECT * FROM produtos WHERE categoria_id = ?', [categoriaId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

exports.pesquisarProdutos = (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      error: 'Termo de pesquisa deve ter pelo menos 2 caracteres'
    });
  }

  const termoPesquisa = q.trim().toLowerCase();

  const query = `
    SELECT 
      p.id,
      p.nome,
      p.descricao,
      p.preco,
      p.estoque,
      p.imagem,
      p.categoria_id,
      p.data_cadastro,
      c.nome as categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE 
      (LOWER(p.nome) LIKE ? OR LOWER(p.descricao) LIKE ?)
      AND p.estoque > 0
    ORDER BY 
      CASE 
        WHEN LOWER(p.nome) LIKE ? THEN 1
        WHEN LOWER(p.nome) LIKE ? THEN 2
        ELSE 3
      END,
      p.nome ASC
    LIMIT 20
  `;

  const searchTerm = `%${termoPesquisa}%`;
  const exactTerm = `${termoPesquisa}%`;

  db.query(query, [searchTerm, searchTerm, exactTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Erro ao pesquisar produtos:', err);
      return res.status(500).json({ error: 'Erro interno do servidor ao pesquisar produtos' });
    }

    const produtosFormatados = results.map(produto => ({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: parseFloat(produto.preco),
      estoque: produto.estoque,
      imagem: produto.imagem,
      categoria_id: produto.categoria_id,
      categoria_nome: produto.categoria_nome,
      data_cadastro: produto.data_cadastro
    }));

    res.json(produtosFormatados);
  });
};
