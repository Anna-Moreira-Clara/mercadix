import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [mensagem, setMensagem] = useState("");
  const [quantidades, setQuantidades] = useState({});

  
  
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

  const adicionarAoCarrinho = (produto) => {
    const quantidade = quantidades[produto.id] || 1; // Padrão 1 se não selecionado
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarios"));

    if (Array.isArray(usuarioLogado)) {
      usuarioLogado = usuarioLogado[0];
    }

    if (usuarioLogado) {
      axios
        .post(`http://localhost:5000/carrinho`, {
          usuario_id: usuarioLogado.id,
          produto_id: produto.id,
          quantidade: quantidade,
        })
        .then((res) => {
          setMensagem(`${produto.nome} adicionado ao carrinho!`);
          setTimeout(() => setMensagem(""), 3000);
          window.dispatchEvent(new Event("carrinhoAtualizado"));
        })
        .catch((err) => {
          console.error("Erro ao adicionar ao carrinho:", err.response?.data || err.message);
          setMensagem("Erro ao adicionar ao carrinho: " + (err.response?.data?.message || err.message));
        });
    } else {
      const carrinhoLocal = JSON.parse(localStorage.getItem("carrinho_local")) || [];
      const produtoExistente = carrinhoLocal.find((item) => item.id === produto.id);

      if (produtoExistente) {
        produtoExistente.quantidade += quantidade;
        produtoExistente.subtotal = produtoExistente.quantidade * produtoExistente.preco;
      } else {
        carrinhoLocal.push({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: quantidade,
          subtotal: produto.preco * quantidade,
        });
      }

      localStorage.setItem("carrinho_local", JSON.stringify(carrinhoLocal));
      setMensagem(`${produto.nome} adicionado ao carrinho!`);
      setTimeout(() => setMensagem(""), 3000);
      window.dispatchEvent(new Event("carrinhoAtualizado"));
    }
 //
    // Reseta a quantidade após adicionar
    setQuantidades((prev) => ({
      ...prev,
      [produto.id]: 0,
    }));
  };

  return (
    <div className="produtos-pagina">
      {mensagem && <div className="mensagem-feedback">{mensagem}</div>}

      {carregando ? (
        <div className="carregando">Carregando produtos...</div>
      ) : (
        <section className="produtos-container">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div key={produto.id} className="produto">
                <img
                  src={`/imagens/${produto.imagem}`}
                  alt={produto.nome}
                  className="imagem-produto"
                />
                <p>{produto.nome}</p>
                <p className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>

                <div className="controle-quantidade">
                  <button className="bot" onClick={() => diminuirQuantidade(produto.id)}>-</button>
                  <span>{quantidades[produto.id] || 1}</span>
                  <button className="bot" onClick={() => aumentarQuantidade(produto.id)}>+</button>
                  <button
                    className="add-to-cart"
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="sem-produtos">
              Nenhum produto encontrado nesta categoria
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Produtos;
