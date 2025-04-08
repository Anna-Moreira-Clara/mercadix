const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRoutes); // <-- Suas rotas estão aqui

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
