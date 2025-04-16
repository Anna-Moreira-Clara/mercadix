// Importando as dependências
require ('dotenv').config(); //dotenv -> carrega as variáveis de amibiente do arquivo .env
const express = require('express'); //express-> framework para criar o servidor e rotas da API
const mysql = require('mysql2'); //mysql2-> biblioteca para conectar ao mysql
const cors = require('cors'); //cors-> permite que o frontend(react) se conecte ao backend sem bloqueios


//Inicialização do Express
const app = express(); //Inicializa o servidor
app.use(cors()); //Permite que o frontend acesse a API sem problemas de Cors
app.use(express.json()); // Permite receber dados no formato JSON no corpo das requisições

//rota usuários
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios',usuariosRouter);

//rota categorias
const categoriasRouter = require('./routes/categorias');
app.use('/categorias', categoriasRouter);

//rota produtos
const produtosRouter = require('./routes/produtos');
app.use('/produtos', produtosRouter);

//rota carrinho
const carrinhoRouter = require('./routes/carrinho');
app.use('/carrinho', carrinhoRouter);

//rota pedidos
const pedidosRouter = require('./routes/pedidos');
app.use('/pedidos', pedidosRouter);

//Conexão com o Banco de Dados
const db = mysql.createConnection({ //Cria a conexão com o banco de dados MySQL.
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    //As credenciais (host, user, password, database) vêm do arquivo .env.  db.connect(err => {...}) → Testa a conexão e exibe uma mensagem no console.

});
db.connect(err =>{
    if(err){
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

//Criando Rota de Teste
app.get('/',(req,res)=>{ //Define uma rota na URL http://localhost:5000/
    res.send('API do site está rodando!'); //Se alguém acessar essa rota, o servidor responderá com essa mensagem
});

//Definição da Porta e Inicialização do Servidor
const PORT = 5000;
app.listen(PORT, () =>{ //Inicia o servidor e exibe uma mensagem no console
    console.log(`Servidor rodando na porta ${PORT} `);
});
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { produto, estoque, preco } = req.body;
  
    const sql = 'UPDATE produtos SET produto = ?, estoque = ?, preco = ? WHERE id = ?';
    const values = [produto, quantidade, preco, id];
  
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Produto atualizado com sucesso!' });
    });
  });
  router.get('/categorias', (req, res) => {
    // Faça a consulta ao banco de dados para buscar todas as categorias
    db.query('SELECT * FROM categorias', (err, results) => {
      if (err) {
        console.error('Erro ao buscar categorias:', err);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
      }
      
      // Retorne as categorias como JSON
      res.json(results);
    });
  });
  

  router.get('/categorias', (req, res) => {
    db.query('SELECT * FROM categorias ORDER BY nome', (err, results) => {
      if (err) {
        console.error('Erro ao buscar categorias:', err);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
      }
      
      res.json(results);
    });
  });
  
  // Rota para buscar categoria pelo ID
  router.get('/categorias/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT * FROM categorias WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar categoria:', err);
        return res.status(500).json({ error: 'Erro ao buscar categoria' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(results[0]);
    });
  });
  
  // Rota para buscar categoria pelo slug
  router.get('/categorias/slug/:slug', (req, res) => {
    const { slug } = req.params;
    
    db.query('SELECT * FROM categorias WHERE slug = ?', [slug], (err, results) => {
      if (err) {
        console.error('Erro ao buscar categoria pelo slug:', err);
        return res.status(500).json({ error: 'Erro ao buscar categoria' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(results[0]);
    });
  });
  
  // Rota para adicionar categoria
  router.post('/categorias', (req, res) => {
    const { nome, slug } = req.body;
    
    // Verifica se o slug já existe
    db.query('SELECT * FROM categorias WHERE slug = ?', [slug], (err, results) => {
      if (err) {
        console.error('Erro ao verificar slug:', err);
        return res.status(500).json({ error: 'Erro ao verificar slug' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Já existe uma categoria com este slug' });
      }
      
      // Insere a nova categoria
      db.query('INSERT INTO categorias (nome, slug) VALUES (?, ?)', [nome, slug], (err, result) => {
        if (err) {
          console.error('Erro ao adicionar categoria:', err);
          return res.status(500).json({ error: 'Erro ao adicionar categoria' });
        }
        
        res.status(201).json({ 
          id: result.insertId,
          nome,
          slug
        });
      });
    });
  });
  
  // Rota para atualizar categoria
  router.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nome, slug } = req.body;
    
    // Verifica se o slug já existe (exceto para a própria categoria)
    db.query('SELECT * FROM categorias WHERE slug = ? AND id != ?', [slug, id], (err, results) => {
      if (err) {
        console.error('Erro ao verificar slug:', err);
        return res.status(500).json({ error: 'Erro ao verificar slug' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Já existe outra categoria com este slug' });
      }
      
      // Atualiza a categoria
      db.query('UPDATE categorias SET nome = ?, slug = ? WHERE id = ?', [nome, slug, id], (err) => {
        if (err) {
          console.error('Erro ao atualizar categoria:', err);
          return res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
        
        res.json({ 
          id: Number(id),
          nome,
          slug
        });
      });
    });
  });
  
  // Rota para excluir categoria
  router.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    
    // Verificar se existem produtos associados a esta categoria
    db.query('SELECT COUNT(*) AS total FROM produtos WHERE categoria_id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao verificar produtos:', err);
        return res.status(500).json({ error: 'Erro ao verificar produtos' });
      }
      
      if (results[0].total > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir esta categoria pois existem produtos associados a ela',
          produtosAssociados: results[0].total
        });
      }
      
      // Exclui a categoria
      db.query('DELETE FROM categorias WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Erro ao excluir categoria:', err);
          return res.status(500).json({ error: 'Erro ao excluir categoria' });
        }
        
        res.json({ message: 'Categoria excluída com sucesso' });
      });
    });
  });
  
  // Rota para buscar produtos por categoria
  router.get('/produtos/categoria/:categoriaId', (req, res) => {
    const { categoriaId } = req.params;
    
    db.query('SELECT * FROM produtos WHERE categoria_id = ?', [categoriaId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar produtos da categoria:', err);
        return res.status(500).json({ error: 'Erro ao buscar produtos da categoria' });
      }
      
      res.json(results);
    });
  });
  
  // Exporte o router ou adicione ao app
  module.exports = router;
