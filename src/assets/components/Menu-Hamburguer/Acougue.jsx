import batata from "../Categorias/imagens/batata.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import uva from "../Categorias/imagens/uva.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  "batata.jpg": batata,
  "morango.jpg": morango,
  "uva.jpg": uva,
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

  // Lista de nomes que você deseja mostrar
  const nomesPermitidos = ["Batata", "Morango", "Uva"];

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
