// Importando as dependências
require ('dotenv').config(); //dotenv -> carrega as variáveis de amibiente do arquivo .env
const express = require('express'); //express-> framework para criar o servidor e rotas da API
const mysql = require('mysql'); //mysql2-> biblioteca para conectar ao mysql
const cors = require('cors'); //cors-> permite que o frontend(react) se conecte ao backend sem bloqueios
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios',usuariosRouter);

//Inicialização do Express
const app = express(); //Inicializa o servidor
app.use(cors()); //Permite que o frontend acesse a API sem problemas de Cors
app.use(express.json()); // Permite receber dados no formato JSON no corpo das requisições

//Conexão com o Banco de Dados
const db = mysql.createConnection({ //Cria a conexão com o banco de dados MySQL.
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_NAME
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












