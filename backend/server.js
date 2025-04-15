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
  