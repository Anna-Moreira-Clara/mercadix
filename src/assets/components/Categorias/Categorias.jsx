import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const buscarProdutos = () => {
    setCarregando(true);
    const url = categoriaId
      ? `http://localhost:5000/produtos/categoria/${categoriaId}`
      : `http://localhost:5000/produtos`;

    axios
      .get(url)
      .then((res) => {
        setProdutos(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setCarregando(false);
      });
  };

  useEffect(() => {
    buscarProdutos();
  }, [categoriaId]);

<<<<<<< HEAD
=======
  // Manipulador de clique na categoria
  const selecionarCategoria = (id) => {
    navigate(`/categoria/${id}`);
  };
  const [quantidades, setQuantidades] = useState({});

const aumentarQuantidade = (id) => {
  setQuantidades((prev) => ({
    ...prev,
    [id]: (prev[id] || 0) + 1,
  }));
};

const diminuirQuantidade = (id) => {
  setQuantidades((prev) => ({
    ...prev,
    [id]: Math.max((prev[id] || 0) - 1, 0),
  }));
};


>>>>>>> c1b1e699f1fa099606f6abeaf95a352ed8b6a963
  return (
    <div className="produtos-pagina">
      {carregando ? (
        <div className="carregando">Carregando produtos...</div>
      ) : (
        <section className="produtos-container">
<<<<<<< HEAD
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div key={produto.id} className="produto">
                <img
                  src={`/imagens/${produto.imagem}`}
                  alt={produto.nome}
                  className="imagem-produto"
                />
                <p>{produto.nome}</p>
                <p className="preco">
                  R$ {parseFloat(produto.preco).toFixed(2)}
                </p>
                <button className="add-to-cart">Adicionar</button>
              </div>
            ))
          ) : (
            <div className="sem-produtos">
              Nenhum produto encontrado nesta categoria
            </div>
          )}
        </section>
=======
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div key={produto.id} className="produto">
              <img
                src={imagens[produto.imagem] || morango} // usa imagem local ou imagem padrão
                alt={produto.nome}
                className="imagem-produto"
              />
              <p>{produto.nome}</p>
              <p className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>
      
              <div className="controle-quantidade">
                <button className="bot" onClick={() => diminuirQuantidade(produto.id)}>-</button>
                <span>{quantidades[produto.id] || 0}</span>
                <button className="bot" onClick={() => aumentarQuantidade(produto.id)}>+</button>
                <button className="add-to-cart">Adicionar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="sem-produtos">Nenhum produto encontrado nesta categoria</div>
        )}
      </section>
      
>>>>>>> c1b1e699f1fa099606f6abeaf95a352ed8b6a963
      )}
    </div>
  );
};

export default Produtos;
