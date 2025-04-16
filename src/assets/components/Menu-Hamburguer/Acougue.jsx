import picanha from "../Categorias/imagens/picanha.png";
import linguica from "../Categorias/imagens/linguiça.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  "picanha.png": picanha,
  "linguiça.jpg": linguica,
};

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const { slug } = useParams(); // Pega o slug da categoria da URL

  useEffect(() => {
    // Primeiro busca a categoria pelo slug
    axios
      .get(`http://localhost:5000/categorias/slug/${slug}`)
      .then((response) => {
        setCategoria(response.data);
        
        // Com o ID da categoria, busca os produtos dessa categoria
        return axios.get(`http://localhost:5000/produtos/categoria/${response.data.id}`);
      })
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar categoria ou produtos:", error);
      });
  }, [slug]);

  // Caso não tenha o parâmetro slug na URL, buscará todos os produtos
  useEffect(() => {
    if (!slug) {
      axios
        .get("http://localhost:5000/produtos")
        .then((response) => {
          setProdutos(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos:", error);
        });
    }
  }, [slug]);

  return (
    <section className="produtos-container">
      {categoria && <h2 className="categoria-titulo">{categoria.nome}</h2>}
      
      {produtos.length === 0 ? (
        <p className="sem-produtos">Nenhum produto encontrado nesta categoria.</p>
      ) : (
        produtos.map((produto) => (
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
        ))
      )}
    </section>
  );
};

export default Produtos;