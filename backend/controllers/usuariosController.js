const db = require('../db');
const bcrypt = require('bcrypt'); // Para criptografar senhas

// Criar um novo usuário
exports.criarUsuario = (req, res) => {
    const { nome, cpf, email, senha, endereco, telefone, role } = req.body;
    
    // Verifica se o email já existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }
        
        // Verifica se o CPF já existe
        db.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (result.length > 0) {
                return res.status(400).json({ error: 'Este CPF já está cadastrado' });
            }
            
            // Hash da senha antes de salvar no banco
            bcrypt.hash(senha, 10, (err, hashedSenha) => {
                if (err) return res.status(500).json({ error: err.message });
                
                const sql = 'INSERT INTO usuarios (nome, cpf, email, senha, endereco, telefone, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
                
                db.query(sql, [nome, cpf, email, hashedSenha, endereco, telefone, role || 'cliente'], (err, result) => {
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

// Buscar usuário por ID
exports.buscarUsuarioPorId = (req, res) => {
    db.query('SELECT id, nome, cpf, email, endereco, telefone, role FROM usuarios WHERE id = ?', 
    [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json(result[0]);
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