//aqui é o lugar onde ficam todas as funções que lidam com os dados dos produtos.

const db = require('../db'); //aqui importo o módulo db, ele é responsável por estabelecer a conexão com o MySQL

//criar Produto
exports.criarProduto = (req,res) =>{ //exports.criarProduto: Cria uma função que será exportada para ser usada nas rotas.
    const{nome, descricao, preco, estoque, imagem, categoria_id} = req.body; //req.body: Lê os dados enviados pelo cliente (nome, descrição, preço, etc.) ao fazer um POST.

    const sql = 'INSERT INTO produtos(nome, descricao, preco, estoque, imagem, categoria_id, data_cadastro) VALUES (?,?,?,?,?,?, NOW())'; //Executa a query SQL, passando os valores como array (evita SQL Injection) Se ocorrer um erro, err vai conter os detalhes.
    db.query(sql,[nome, descricao, preco, estoque,imagem,categoria_id],(err,result)=>{
        if(err) return res.status(500).json({error: err.message}); //se der erro, exibe uma mensagem de erro
        res.status(201).json({message: 'Produto cadastrado!',id: result.insertId}); //se funcinar exibe essa mensagem
    });
};

//listar produto


