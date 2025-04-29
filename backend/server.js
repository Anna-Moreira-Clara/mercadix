// Importando as dependências
require('dotenv').config(); // dotenv -> carrega as variáveis de ambiente do arquivo .env
const express = require('express'); // express -> framework para criar o servidor e rotas da API
const mysql = require('mysql2'); // mysql2 -> biblioteca para conectar ao MySQL
const cors = require('cors'); // cors -> permite que o frontend (React) se conecte ao backend sem bloqueios


// Inicialização do Express
const app = express();
app.use(cors());
app.use(express.json());


// Rotas
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);


const categoriasRouter = require('./routes/categorias');
app.use('/categorias', categoriasRouter);


const produtosRouter = require('./routes/produtos');
app.use('/produtos', produtosRouter);


const carrinhoRouter = require('./routes/carrinho');
app.use('/carrinho', carrinhoRouter);


const pedidosRouter = require('./routes/pedidos');
app.use('/pedidos', pedidosRouter);


// Conexão com o Banco de Dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});


db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});


// Rota de teste
app.get('/', (req, res) => {
  res.send('API do site está rodando!');
});


// Atualização de produto
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { produto, estoque, preco } = req.body;


  const sql = 'UPDATE produtos SET produto = ?, estoque = ?, preco = ? WHERE id = ?';
  const values = [produto, estoque, preco, id]; // corrigido de "quantidade" para "estoque"


  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto atualizado com sucesso!' });
  });
});


// Inicialização do servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



