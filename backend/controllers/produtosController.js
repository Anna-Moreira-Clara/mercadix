/*Resumo do que esse controller faz:
Esse arquivo centraliza toda a lógica de manipulação dos dados de produtos: criar, listar, buscar por ID, atualizar e excluir. 
Ele deixa o código mais organizado e modular, já que as rotas (em routes/produtos.js) só se preocupam com direcionar
as requisições para o método correto do controller.*/



// Importa a conexão com o banco de dados
const db = require('../db');

// Cria um novo produto
exports.criarProduto = (req, res) => {
  const { nome, descricao, preco, estoque, imagem, categoria_id } = req.body;

  // SQL para inserir produto
  const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria_id, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, NOW())';

  // Executa a query passando os valores do body
  db.query(sql, [nome, descricao, preco, estoque, imagem, categoria_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Retorna sucesso com o ID gerado
    res.status(201).json({ message: 'Produto cadastrado!', id: result.insertId });
  });
};

// Lista todos os produtos
exports.listarProdutos = (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results); // Retorna todos os produtos
  });
};

// Busca um produto pelo ID
exports.buscarProdutoPorId = (req, res) => {
  db.query('SELECT * FROM produtos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result[0]); // Retorna o produto encontrado
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
// Adicione esta função ao arquivo backend/controllers/produtosController.js

// Busca produtos por categoria_id
exports.buscarProdutosPorCategoria = (req, res) => {
  const categoriaId = req.params.categoriaId;
  
  db.query('SELECT * FROM produtos WHERE categoria_id = ?', [categoriaId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    res.json(results); // Retorna os produtos da categoria
  });
};