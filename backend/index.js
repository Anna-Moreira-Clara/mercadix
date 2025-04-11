const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const carrinhoRoutes = require('./routes/carrinho');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/usuarios', usuariosRoutes); // <-- Suas rotas estão aqui
app.use('/carrinho', carrinhoRoutes);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
