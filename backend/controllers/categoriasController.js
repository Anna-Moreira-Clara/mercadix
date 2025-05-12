const db = require('../db'); // importa a conexão com o banco de dados

// Criar nova categoria
// Criar nova categoria
exports.criarCategoria = (req, res) => {
  const { nome, descricao } = req.body; // Incluindo descricao aqui

  // SQL para inserir categoria com descricao
  const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';

  db.query(sql, [nome, descricao], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: 'Categoria criada com sucesso!', id: result.insertId });
  });
};


// Listar categorias
exports.listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

// Atualizar categoria por ID
exports.atualizarCategoria = (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';

  db.query(sql, [nome, descricao, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Categoria atualizada com sucesso!' });
  });
};

// Deletar categoria por ID
exports.deletarCategoria = (req, res) => {
  db.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Categoria deletada com sucesso!' });
  });
};
