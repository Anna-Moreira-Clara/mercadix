import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  // Estado para mensagem de feedback
  const [mensagem, setMensagem] = useState("");

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

  // Função para adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarios"));
    
    // CORREÇÃO: Se for array, pega o primeiro usuário
    if (Array.isArray(usuarioLogado)) {
      usuarioLogado = usuarioLogado[0];
    }

    console.log("Usuário logado:", usuarioLogado); 
    console.log("Produto:", produto);

    if (usuarioLogado) {
      axios
        .post(`http://localhost:5000/carrinho`, {
          usuario_id: usuarioLogado.id,
          produto_id: produto.id,
          quantidade: 1
        })
        .then((res) => {
          console.log("Resposta:", res.data);
          setMensagem(`${produto.nome} adicionado ao carrinho!`);
          setTimeout(() => setMensagem(""), 3000);
          window.dispatchEvent(new Event('carrinhoAtualizado'));
        })
        .catch((err) => {
          console.error("Erro ao adicionar ao carrinho:", err.response?.data || err.message);
          setMensagem("Erro ao adicionar ao carrinho: " + (err.response?.data?.message || err.message));
        });
    } else {
      // Usuário não logado, salvar no localStorage
      const carrinhoLocal = JSON.parse(localStorage.getItem("carrinho_local")) || [];

      // Verificar se o produto já está no carrinho
      const produtoExistente = carrinhoLocal.find(item => item.id === produto.id);

      if (produtoExistente) {
        // Atualizar quantidade
        produtoExistente.quantidade += 1;
        produtoExistente.subtotal = produtoExistente.quantidade * produtoExistente.preco;
      } else {
        // Adicionar novo item
        carrinhoLocal.push({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          subtotal: produto.preco
        });
      }

      // Salvar no localStorage
      localStorage.setItem("carrinho_local", JSON.stringify(carrinhoLocal));

      setMensagem(`${produto.nome} adicionado ao carrinho!`);
      setTimeout(() => setMensagem(""), 3000);

      window.dispatchEvent(new Event('carrinhoAtualizado'));
    }
  };

  return (
    <div className="produtos-pagina">
      {mensagem && (
        <div className="mensagem-feedback">
          {mensagem}
        </div>
      )}

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
                <p className="preco">
                  R$ {parseFloat(produto.preco).toFixed(2)}
                </p>
                <button 
                  className="add-to-cart"
                  onClick={() => adicionarAoCarrinho(produto)}
                >
                  Adicionar
                </button>
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
