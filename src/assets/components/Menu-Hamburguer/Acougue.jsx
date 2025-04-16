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

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/produtos")
      .then((response) => {
        setProdutos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
        setError("Falha ao carregar produtos");
        setLoading(false);
      });
  }, []);

  // Lista de nomes que você deseja mostrar
  const nomesPermitidos = ["Linguiça Calabresa Seara", "Picanha Montana"];

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro: {error}</div>;

  const produtosFiltrados = produtos.filter((produto) => 
    nomesPermitidos.includes(produto.nome)
  );

  return (
    <section className="produtos-container">
      {produtosFiltrados.length > 0 ? (
        produtosFiltrados.map((produto) => (
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
      ) : (
        <div>Nenhum produto encontrado</div>
      )}
    </section>
  );
};

export default Produtos;