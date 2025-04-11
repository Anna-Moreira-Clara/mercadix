import picanha from "../Categorias/imagens/picanha.png";
import linguica from "../Categorias/imagens/linguiça.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
    "picanha.png": picanha,
    "linguiça.jpg": linguica,
     
};
//picanha.png
//linguiça.jpg

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
  const nomesPermitidos = ["Linguiça", "Picanha"];

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
