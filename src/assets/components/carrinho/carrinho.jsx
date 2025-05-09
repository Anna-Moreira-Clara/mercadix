import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMinus, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './carrinho.css'; // Você pode criar este arquivo de estilo depois

const Carrinho = () => {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoTotal, setCarrinhoTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endereco, setEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('cartao');

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const carregarCarrinho = async () => {
    setLoading(true);
    
    // Verificar se há dados salvos do carrinho completo
    const carrinhoCompleto = JSON.parse(localStorage.getItem('carrinho_completo'));
    
    if (carrinhoCompleto && carrinhoCompleto.itens.length > 0) {
      setCarrinho(carrinhoCompleto.itens);
      setCarrinhoTotal(carrinhoCompleto.total);
      setLoading(false);
      return;
    }
    
    // Se não houver dados salvos, carregar do backend
    let usuario = JSON.parse(localStorage.getItem('usuarios'));

    // Trate o caso onde usuários é um array
    if (Array.isArray(usuario)) {
      usuario = usuario[0];
    }

    if (usuario && usuario.id) {
      try {
        const res = await axios.get(`/carrinho/${usuario.id}`);
        setCarrinho(res.data);
        
        // Calcular o total
        const total = res.data.reduce(
          (acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0), 
          0
        );
        setCarrinhoTotal(total);
      } catch (err) {
        console.error("Erro ao buscar carrinho:", err);
      }
    } else {
      // Carregar do carrinho local se não estiver logado
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      setCarrinho(carrinhoLocal);
      
      const total = carrinhoLocal.reduce(
        (acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0), 
        0
      );
      setCarrinhoTotal(total);
    }
    
    setLoading(false);
  };

  // Função para atualizar quantidade
  const atualizarQuantidade = async (item, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(item);
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarios'));
    
    if (usuario && usuario.id) {
      try {
        await axios.put(`/carrinho/${item.id}`, { quantidade: novaQuantidade });
        carregarCarrinho();
      } catch (err) {
        console.error("Erro ao atualizar quantidade:", err);
      }
    } else {
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      const itemIndex = carrinhoLocal.findIndex(i => i.id === item.id);

      if (itemIndex !== -1) {
        carrinhoLocal[itemIndex].quantidade = novaQuantidade;
        carrinhoLocal[itemIndex].subtotal = carrinhoLocal[itemIndex].preco * novaQuantidade;
        localStorage.setItem('carrinho_local', JSON.stringify(carrinhoLocal));
        
        // Atualizar o estado
        const newCarrinho = [...carrinhoLocal];
        setCarrinho(newCarrinho);
        
        // Recalcular o total
        const total = newCarrinho.reduce(
          (acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0), 
          0
        );
        setCarrinhoTotal(total);
      }
    }
  };

  // Função para remover um item
  const removerItem = async (item) => {
    const usuario = JSON.parse(localStorage.getItem('usuarios'));
    
    if (usuario && usuario.id) {
      try {
        await axios.delete(`/carrinho/${item.id}`);
        carregarCarrinho();
      } catch (err) {
        console.error("Erro ao remover item:", err);
      }
    } else {
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      const newCarrinho = carrinhoLocal.filter(i => i.id !== item.id);
      localStorage.setItem('carrinho_local', JSON.stringify(newCarrinho));
      
      // Atualizar o estado
      setCarrinho(newCarrinho);
      
      // Recalcular o total
      const total = newCarrinho.reduce(
        (acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0), 
        0
      );
      setCarrinhoTotal(total);
    }
  };

  // Função para finalizar pedido
  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let usuario = JSON.parse(localStorage.getItem('usuarios'));
    
    if (Array.isArray(usuario)) {
      usuario = usuario[0];
    }

    if (!usuario || !usuario.id) {
      alert("Faça login para finalizar a compra!");
      navigate('/');
      return;
    }

    if (!endereco) {
      alert("Por favor, informe o endereço de entrega!");
      return;
    }

    try {
      await axios.post('/pedidos', {
        usuario_id: usuario.id,
        endereco_entrega: endereco,
        forma_pagamento: formaPagamento,
        itens: carrinho.map(item => ({
          produto_id: item.produto_id || item.id,
          quantidade: item.quantidade,
          preco: item.preco
        }))
      });

      alert("Pedido finalizado com sucesso!");
      
      // Limpar carrinho no backend
      await axios.delete(`/carrinho/usuario/${usuario.id}`);
      
      // Limpar localStorage
      localStorage.removeItem('carrinho_completo');
      
      // Redirecionar para página de confirmação ou histórico de pedidos
      navigate('/pedidos');
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  const voltarParaCompras = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="carrinho-container">Carregando...</div>;
  }

  return (
    <div className="carrinho-container">
      <div className="carrinho-header">
        <button className="voltar-btn" onClick={voltarParaCompras}>
          <FaArrowLeft /> Voltar para compras
        </button>
        <h1>Carrinho Completo</h1>
      </div>

      {carrinho.length === 0 ? (
        <div className="carrinho-vazio">
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos ao seu carrinho para continuar</p>
          <button className="continuar-comprando" onClick={voltarParaCompras}>
            Continuar Comprando
          </button>
        </div>
      ) : (
        <div className="carrinho-completo">
          <div className="carrinho-items">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Subtotal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <tr key={item.id} className="item-row">
                    <td className="item-nome">{item.nome}</td>
                    <td className="item-preco">R$ {parseFloat(item.preco).toFixed(2)}</td>
                    <td className="item-quantidade">
                      <div className="quantidade-controls">
                        <button
                          className="qty-btn"
                          onClick={() => atualizarQuantidade(item, item.quantidade - 1)}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="quantidade">{item.quantidade}</span>
                        <button
                          className="qty-btn"
                          onClick={() => atualizarQuantidade(item, item.quantidade + 1)}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </td>
                    <td className="item-subtotal">
                      R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                    </td>
                    <td className="item-acoes">
                      <button
                        className="remove-btn"
                        onClick={() => removerItem(item)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="carrinho-resumo">
            <h3>Resumo do Pedido</h3>
            <div className="resumo-item">
              <span>Subtotal:</span>
              <span>R$ {carrinhoTotal.toFixed(2)} </span>
            </div>
            <div className="resumo-item">
              <span>Frete:</span>
              <span>R$:10,00</span>
            </div>
            <div className="resumo-item total">
              <span>Total:</span>
              <span>R$ {carrinhoTotal.toFixed(2)}</span>
            </div>

            <div className="checkout-form">
              <div className="form-group">
                <label>Endereço de Entrega:</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Digite seu endereço completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>Forma de Pagamento:</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                 
                  <option value="entrega">NA ENTREGA</option>
                  
                </select>
              </div>

              <button className="finalizar-compra-btn" onClick={finalizarPedido}>
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;