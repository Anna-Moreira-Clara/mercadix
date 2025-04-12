import batata from "../Categorias/imagens/batata.jpg";
import leite from "../Categorias/imagens/leiteninho.jpg";
import picanha from "../Categorias/imagens/picanha.png";
import linguica from "../Categorias/imagens/linguiça.jpg";
import whisky from "../Categorias/imagens/whisky.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import uva from "../Categorias/imagens/uva.jpg";
import gin from "../Categorias/imagens/gin rose.jpg";
import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  "batata.jpg": batata,
  "leiteninho.jpg": leite,
  "picanha.png": picanha,
  "linguiça.jpg": linguica,
  "whisky.jpg": whisky,
  "morango.jpg": morango,
  "uva.jpg": uva,
  "gin rose.jpg": gin,
};

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/produtos")
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  const adicionarAoCarrinho = async (produtoId) => {
    const usuario = JSON.parse(localStorage.getItem('usuarios'));
    if (!usuario) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      return;
    }
  
    try {
      await axios.post('/carrinho', {
        usuario_id: usuario.id,
        produto_id: produtoId,
        quantidade: 1 // ou uma quantidade selecionada
      });
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho.");
    }
  };

  return (
    <section className="produtos-container">
      {produtos.map((produto) => (
        <div key={produto.id} className="produto">
          <img
            src={imagens[produto.imagem] || morango} // usa imagem local ou imagem padrão
            alt={produto.nome}
            className="imagem-produto"
          />
          <p>{produto.nome}</p>
          <p className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>
          <button className="add-to-cart" onClick={() => adicionarAoCarrinho(produto.id)}>
  Adicionar
</button>
        </div>
      ))}
    </section>
  );
};

export default Produtos;
