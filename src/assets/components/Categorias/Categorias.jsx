import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Importe todas as imagens que você já está utilizando
import batata from "./imagens/batata.jpg";
import leite from "./imagens/leiteninho.jpg";
import picanha from "./imagens/picanha.png";
import whisky from "./imagens/whisky.jpg";
import morango from "./imagens/morango.jpg";
import uva from "./imagens/uva.jpg";
import gin from "./imagens/gin rose.jpg";
import fanta from "./imagens/fantauva.jpg";
import detergente from "./imagens/Detergente em po surf.jpg"
import amaciante from "./imagens/amaciante ype.jpg"
import toalhapapel from "./imagens/sulleg-toalha.jpg";
import lavaroupas from "./imagens/tixan-ype.jpg";
import banana from "./imagens/192347-500-auto.webp";
import cenoura from "./imagens/192373-500-auto.webp";
import tomate from "./imagens/192388-500-auto.webp";
import alho from "./imagens/192396-500-auto.webp";
import filefrango from "./imagens/filedefrango.jpg";
import filepeito from "./imagens/filedepeito.jpg";
import peitofrango from "./imagens/peitodefrango.jpg";
import presunto from "./imagens/presuntoperdigao.jpg";
import salsicha from "./imagens/salsichasadia.jpg";
import hamburguer from "./imagens/hamburguerperdigao.jpg";
import salsichaperd from "./imagens/salsichaperdigao.jpg";
import linguica from "./imagens/linguiça.jpg";
import leitepo from "./imagens/quataleite.jpg";
import leiteitalac from "./imagens/italacleitempo.jpg";
import sucokapo from "./imagens/kapo.jpg";
import sucobento from "./imagens/sucouvabento.jpg";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  "batata.jpg": batata,
  "leiteninho.jpg": leite,
  "picanha.png": picanha,
  "whisky.jpg": whisky,
  "morango.jpg": morango,
  "uva.jpg": uva,
  "gin rose.jpg": gin,
  "fantauva.jpg": fanta,
  "Detergente em po surf.jpg": detergente,
  "amaciante ype.jpg": amaciante,
  "sulleg-toalha.jpg": toalhapapel,
  "tixan-ype.jpg": lavaroupas,
  "192347-500-auto.webp": banana,
  "192373-500-auto.webp": cenoura,
  "192388-500-auto.webp": tomate,
  "192396-500-auto.webp": alho,
  "filedefrango.jpg": filefrango,
  "filedepeito.jpg": filepeito,
  "peitodefrango.jpg": peitofrango,
  "presuntoperdigao.jpg": presunto,
  "salsichasadia.jpg": salsicha,
  "hamburguerperdigao.jpg": hamburguer,
  "salsichaperdigao.jpg": salsichaperd,
  "linguiça.jpg": linguica,
  "quataleite.jpg": leitepo,
  "italacleitempo.jpg": leiteitalac,
  "kapo.jpg": sucokapo,
  "sucouvabento.jpg": sucobento,
};

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  // Função para buscar produtos por categoria
  const buscarProdutosPorCategoria = (id) => {
    setCarregando(true);
    axios
      .get(`http://localhost:5000/produtos/categoria/${id}`)
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos por categoria:", error);
        setCarregando(false);
      });
  };

  // Função para buscar todos os produtos
  const buscarTodosProdutos = () => {
    setCarregando(true);
    axios
      .get("http://localhost:5000/produtos")
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
        setCarregando(false);
      });
  };

  // Buscar categorias
  useEffect(() => {
    axios
      .get("http://localhost:5000/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
      });

    // Se tiver categoriaId na URL, busca produtos daquela categoria
    if (categoriaId) {
      buscarProdutosPorCategoria(categoriaId);
    } else {
      buscarTodosProdutos();
    }
  }, [categoriaId]);

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


  return (
    <div className="produtos-pagina">
   
      {/* Exibição dos produtos */}
      {carregando ? (
        <div className="carregando">Carregando produtos...</div>
      ) : (
        <section className="produtos-container">
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
      
      )}
    </div>
  );
};

export default Produtos;