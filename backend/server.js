require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conecta com as rotas (controllers)
app.use('/usuarios', require('./routes/usuarios'));
app.use('/categorias', require('./routes/categorias'));
app.use('/produtos', require('./routes/produtos'));
app.use('/carrinho', require('./routes/carrinho'));
app.use('/pedidos', require('./routes/pedidos'));

// Conexão com banco de dados
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

// Rota simples de teste
app.get('/', (req, res) => {
  res.send('API do site está rodando!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
