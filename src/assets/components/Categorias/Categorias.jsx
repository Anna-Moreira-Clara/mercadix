import batata from "../Categorias/imagens/batata.jpg";
import leite from "../Categorias/imagens/leiteninho.jpg";
import picanha from "../Categorias/imagens/picanha.png";
import whisky from "../Categorias/imagens/whisky.jpg";
import morango from "../Categorias/imagens/morango.jpg";
import uva from "../Categorias/imagens/uva.jpg";
import gin from "../Categorias/imagens/gin rose.jpg";
import fanta from"../Categorias/imagens/fantauva.jpg";
import detergente from "../Categorias/imagens/Detergente em po surf.jpg"
import amaciante from "../Categorias/imagens/amaciante ype.jpg"
import toalhapapel from "../Categorias/imagens/sulleg-toalha.jpg";
import lavaroupas from "../Categorias/imagens/tixan-ype.jpg";
import banana from "../Categorias/imagens/192347-500-auto.webp";
import  cenoura from "../Categorias/imagens/192373-500-auto.webp";
import tomate from "../Categorias/imagens/192388-500-auto.webp";
import alho from "../Categorias/imagens/192396-500-auto.webp";
import filefrango from "../Categorias/imagens/filedefrango.jpg";
import filepeito from "../Categorias/imagens/filedepeito.jpg";
import peitofrango from "../Categorias/imagens/peitodefrango.jpg";
import presunto from "../Categorias/imagens/presuntoperdigao.jpg";
import salsicha from "../Categorias/imagens/salsichasadia.jpg";
import hamburguer from "../Categorias/imagens/hamburguerperdigao.jpg";
import salsichaperd from "../Categorias/imagens/salsichaperdigao.jpg";
import linguica from "../Categorias/imagens/linguiça.jpg";
import leitepo from "../Categorias/imagens/quataleite.jpg";
import leiteitalac from "../Categorias/imagens/italacleitempo.jpg";


import "./categorias.css";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeando imagens pelos nomes usados no banco
const imagens = {
  "batata.jpg": batata,
  "leiteninho.jpg": leite,
  "picanha.png": picanha,
  "whisky.jpg": whisky,
  "morango.jpg": morango,
  "uva.jpg": uva,
  "gin rose.jpg": gin,
  "fantauva.jpg":fanta,
  "Detergente em po surf.jpg":detergente,
  "amaciante ype.jpg": amaciante,
  "sulleg-toalha.jpg": toalhapapel,
  "tixan-ype.jpg":lavaroupas,
  "192347-500-auto.webp": banana,
  "192373-500-auto.webp": cenoura, 
  "192388-500-auto.webp":tomate,
  "192396-500-auto.webp": alho,
  "filedefrango.jpg":filefrango,
  "filedepeito.jpg":filepeito,
  "peitodefrango.jpg":peitofrango,
  "presuntoperdigao.jpg":presunto,
  "salsichasadia.jpg":salsicha,
  "hamburguerperdigao.jpg":hamburguer,
  "salsichaperdigao.jpg":salsichaperd,
  "linguiça.jpg": linguica,
  "quataleite.jpg":leitepo,
  "italacleitempo.jpg":leiteitalac,

  
  
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

  

  return (
    <section className="produtos-container">
      {produtos.map((produto) => (
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
