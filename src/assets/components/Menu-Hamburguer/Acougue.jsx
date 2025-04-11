import React from "react";
import picanha from "../Categorias/imagens/picanha.png";
import linguica from "../Categorias/imagens/linguiça.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

const imagens = {
  
    "picanha.png": picanha,
    "linguiça.jpg": linguica,
   
   
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
  
    const nomesPermitidos = ["Picanha", "Liinguiça"];
    
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
  

