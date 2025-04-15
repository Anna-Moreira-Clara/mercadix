import batata from "../Categorias/imagens/batata.jpg";
import leite from "../Categorias/imagens/leiteninho.jpg";
import picanha from "../Categorias/imagens/picanha.png";
import linguica from "../Categorias/imagens/linguiça.jpg";
import whisky from "../Categorias/imagens/whisky.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import uva from "../Categorias/imagens/uva.jpg";
import gin from "../Categorias/imagens/gin rose.jpg";
import fanta from"../Categorias/imagens/fantauva.jpg";
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
  "fantauva.jpg":fanta,
  
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
          <button className="add-to-cart">Adicionar</button>
        </div>
      ))}
    </section>
  );
};

export default Produtos;
