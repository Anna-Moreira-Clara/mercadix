//Importar bibliotecas
require('dotenv').config();
const mysql = require('mysql2');

//Criar a conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
//Isso permite que, se precisarmos mudar as credenciais, basta alterar no .env, sem modificar o código.

});
 
//Testando a conexão

db.connect(err =>{
    if(err){
        console.error('Erro ao conectar ao MySQL:',err);
        return;
    }
    console.log('Conectado ao Mysql');
});

//Exportando a conexão
module.exports = db;
