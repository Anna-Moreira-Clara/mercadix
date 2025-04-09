const db = require('../db'); // importa a conexão com o banco de dados

// Criar nova categoria
exports.criarCategoria = (req, res) => {
    const { nome } = req.body;
    const sql = 'INSERT INTO categorias(nome) VALUES(?)';

    db.query(sql, [nome], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: 'Categoria criada com sucesso!', id: result.insertId });
    });
};

// Listar todas as categorias
exports.listarCategorias = (req, res) => {
    db.query('SELECT * FROM categorias', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
};

// Buscar categoria por ID
exports.buscarCategoriaPorId = (req, res) => {
    db.query('SELECT * FROM categorias WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) return res.status(404).json({ error: 'Categoria não encontrada' });

        res.json(result[0]);
    });
};

// Atualizar categoria
exports.atualizarCategoria = (req, res) => {
    const { nome } = req.body;

    db.query('UPDATE categorias SET nome = ? WHERE id = ?', [nome, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada para atualizar' });
        }

        res.json({ message: 'Categoria atualizada com sucesso!' });
    });
};

// Deletar categoria
exports.deletarCategoria = (req, res) => {
    db.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada para deletar' });
        }

        res.json({ message: 'Categoria deletada com sucesso!' });
    });
};
