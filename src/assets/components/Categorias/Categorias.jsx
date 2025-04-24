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
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
    
    if (usuarioLogado) {
      // Usuário está logado, adicionar ao carrinho no backend
      axios
        .post(`http://localhost:5000/carrinho`, {
          usuario_id: usuarioLogado.id,
          produto_id: produto.id,
          quantidade: 1
        })
        .then((res) => {
          setMensagem(`${produto.nome} adicionado ao carrinho!`);
          // Limpar mensagem após 3 segundos
          setTimeout(() => setMensagem(""), 3000);
          // Disparar evento para atualizar a contagem do carrinho na Navbar
          window.dispatchEvent(new Event('carrinhoAtualizado'));
        })
        .catch((err) => {
          console.error("Erro ao adicionar ao carrinho:", err);
          setMensagem("Erro ao adicionar ao carrinho");
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
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMensagem(""), 3000);
      
      // Força atualização do componente Navbar através de um evento personalizado
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
