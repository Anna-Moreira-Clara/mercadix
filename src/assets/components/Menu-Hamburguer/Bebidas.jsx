import whisky from "../Categorias/imagens/whisky.jpg";
import gin from "../Categorias/imagens/gin rose.jpg";
import fanta from "../Categorias/imagens/fantauva.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  
    "whisky.jpg": whisky,
    "gin rose.jpg": gin,
    "fantauva.jpg":fanta,
     
};
//Picanha Montana
//Linguiça Calabresa Seara

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

  // Lista de nomes que você deseja mostrar
  const nomesPermitidos = ["Whisky Ballantines 12 Anos", "Gin Rocks Rose"];

  return (
    <section className="produtos-container">
      {produtos
        .filter((produto) => nomesPermitidos.includes(produto.nome))
        .map((produto) => (
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