import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/produtos")
      .then(response => {
        setProdutos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  return (
    <section className="produtos-container">
      {produtos.map(produto => (
        <div key={produto.id} className="produto">
          <img src={produto.imagem} alt={produto.nome} className="imagem-produto" />
          <p>{produto.nome}</p>
          <p className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>
          <button className="add-to-cart">Adicionar</button>
        </div>
      ))}
    </section>
  );
};


export default Produtos;
