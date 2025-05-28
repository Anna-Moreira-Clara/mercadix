const db = require('../db');
const bcrypt = require('bcrypt'); // Para criptografar senhas

// Criar um novo usuário
exports.criarUsuario = (req, res) => {
    const { nome, cpf, email, senha, endereco, telefone, role } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        db.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length > 0) {
                return res.status(400).json({ error: 'Este CPF já está cadastrado' });
            }

            // Hasheando a senha corretamente aqui
            bcrypt.hash(senha, 10, (err, hashedSenha) => {
                if (err) return res.status(500).json({ error: err.message });

                const sql = 'INSERT INTO usuarios (nome, cpf, email, senha, endereco, telefone, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const values = [nome, cpf, email, hashedSenha, endereco, telefone, role || 'cliente'];

                db.query(sql, values, (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
                });
            });
        });
    });
};


// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
    db.query('SELECT id, nome, cpf, email, endereco, telefone, role FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
};

// Login do usuário
exports.loginUsuario = (req, res) => {
    const { email, senha } = req.body;

    // Busca o usuário pelo email
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email não cadastrado' });
        }

        const usuario = results[0];

        // Compara a senha informada com a senha hash do banco
        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!isMatch) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            // Remove a senha antes de enviar a resposta
            const { senha, ...usuarioSemSenha } = usuario;

            res.status(200).json(usuarioSemSenha);
        });
    });
};


// Atualizar usuário
exports.atualizarUsuario = (req, res) => {
    const { nome, cpf, email, senha, endereco, telefone, role } = req.body;
    const userId = req.params.id;

    // Se a senha foi fornecida, criptografa antes de atualizar
    if (senha) {
        bcrypt.hash(senha, 10, (err, hashedSenha) => {
            if (err) return res.status(500).json({ error: err.message });

            const sql = 'UPDATE usuarios SET nome = ?, cpf = ?, email = ?, senha = ?, endereco = ?, telefone = ?, role = ? WHERE id = ?';

            db.query(sql, [nome, cpf, email, hashedSenha, endereco, telefone, role, userId], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ message: 'Usuário atualizado com sucesso!' });
            });
        });
    } else {
        // Se a senha não foi fornecida, atualiza sem alterar a senha
        const sql = 'UPDATE usuarios SET nome = ?, cpf = ?, email = ?, endereco = ?, telefone = ?, role = ? WHERE id = ?';

        db.query(sql, [nome, cpf, email, endereco, telefone, role, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: 'Usuário atualizado com sucesso!' });
        });
    }
};

// Deletar usuário
exports.deletarUsuario = (req, res) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Usuário removido com sucesso!' });
    });
};

// Adicionar ao final do arquivo usuariosController.js

// Redefinir senha do usuário
exports.redefinirSenha = (req, res) => {
    const { email, novaSenha } = req.body;
    
    if (!email || !novaSenha) {
        return res.status(400).json({ error: 'Email e nova senha são obrigatórios' });
    }

    // Busca o usuário pelo email para verificar se existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Email não encontrado no sistema' });
        }

        const usuario = results[0];

        // Criptografa a nova senha
        bcrypt.hash(novaSenha, 10, (err, hashedSenha) => {
            if (err) return res.status(500).json({ error: err.message });

            // Atualiza a senha no banco de dados
            const sql = 'UPDATE usuarios SET senha = ? WHERE id = ?';
            
            db.query(sql, [hashedSenha, usuario.id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Não foi possível atualizar a senha' });
                }

                res.status(200).json({ message: 'Senha redefinida com sucesso!' });
            });
        });
    });
};

