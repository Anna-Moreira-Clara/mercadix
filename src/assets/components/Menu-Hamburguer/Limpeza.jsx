import amaciante from "../Categorias/imagens/amaciante-ype.jpg";
import detergente from "../Categorias/imagens/detergente-surf.jpg";
import sabao from "../Categorias/imagens/tixan-ype.jpg";
import papel from "../Categorias/imagens/sulleg-toalha.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
    
    "amaciante-ype.jpg": amaciante,
    "detergente-surf.jpg": detergente,
    "tixan-ype.jpg": sabao,
    "sulleg-toalha.jpg": papel,        

     
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
  const nomesPermitidos = ["Amaciante Ypê Aconchego 2L + 400ml", "Detergente em Pó Surf 5 em 1 - 1,6kg", "Tixan Ypê Primavera 2,2kg", "Toalha de Papel Sulleg Multiuso - 2 rolos"];

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