const db = require('../db');

//criar um novo usuário
exports.criarUsuario = (req,res) =>{
    const{nome, cpf, email, senha, endereco, telefone, role} = req.body;
    const sql = 'INSERT INTO usuarios (nome, cpf, email, senha, endereco, telefone,role)VALUES(?,?,?,?,?,?,?)';

    db.query(sql, [nome, cpf, email, senha, endereco, telefone, role], (err,result)=>{
        if(err) return res.status(500).json({error:err.message});

        res.status(201).json({message:'Usuário Criado com Sucesso!', id: result.insertId});

    });
};

//listar todos usuários (sem mostrar a senha)
exports.listarUsuarios = (req, res) => {
    db.query('SELECT id, nome, cpf, email, endereco, telefone, role FROM usuarios', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.json(results);
    });
  };
  
  // Busca um usuário pelo ID (sem mostrar a senha)
  exports.buscarUsuarioPorId = (req, res) => {
    db.query('SELECT id, nome, cpf, email, endereco, telefone, role FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (result.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
  
      res.json(result[0]);
    });
  };
  
  // Atualiza um usuário
  exports.atualizarUsuario = (req, res) => {
    const { nome, cpf, email, senha, endereco, telefone, role } = req.body;
  
    const sql = 'UPDATE usuarios SET nome = ?, cpf = ?, email = ?, senha = ?, endereco = ?, telefone = ?, role = ? WHERE id = ?';
  
    db.query(sql, [nome, cpf, email, senha, endereco, telefone, role, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.json({ message: 'Usuário atualizado com sucesso!' });
    });
  };
  
  // Deleta um usuário
  exports.deletarUsuario = (req, res) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.json({ message: 'Usuário deletado com sucesso!' });
    });
  };
  
