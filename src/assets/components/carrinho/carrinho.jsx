import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMinus, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './carrinho.css';

const Carrinho = () => {
  const FRETE_FIXO = 10.0;
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoTotal, setCarrinhoTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endereco, setEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('cartao');
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarCarrinho();
  }, []);

  // Função para calcular o total do carrinho
  const calcularTotal = (itens) => {
    return itens.reduce(
      (acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0),
      0
    );
  };

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
        setCarrinhoTotal(calcularTotal(res.data));
      } catch (err) {
        console.error("Erro ao buscar carrinho:", err);
        alert("Erro ao carregar carrinho.");
      }
    } else {
      // Carregar do carrinho local se não estiver logado
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      setCarrinho(carrinhoLocal);
      setCarrinhoTotal(calcularTotal(carrinhoLocal));
    }
    
    setLoading(false);
  };

  // Função corrigida para atualizar quantidade - atualiza a UI imediatamente
  const atualizarQuantidade = async (item, novaQuantidade) => {
    if (atualizando) return; // Evita múltiplos cliques durante atualização
    setAtualizando(true);
    
    if (novaQuantidade <= 0) {
      await removerItem(item);
      setAtualizando(false);
      return;
    }

    let usuario = JSON.parse(localStorage.getItem('usuarios'));
    if (Array.isArray(usuario)) {
      usuario = usuario[0];
    }
    
    // Primeiro atualize o estado local para feedback imediato ao usuário
    const novosItens = carrinho.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          quantidade: novaQuantidade,
          subtotal: i.preco * novaQuantidade
        };
      }
      return i;
    });
    
    setCarrinho(novosItens);
    setCarrinhoTotal(calcularTotal(novosItens));
    
    // Então faça a atualização persistente
    if (usuario && usuario.id) {
      try {
        await axios.put(`/carrinho/${item.id}`, { quantidade: novaQuantidade });
        // Não recarregamos o carrinho inteiro para evitar problemas de sincronização
        console.log("Quantidade atualizada no servidor com sucesso");
      } catch (err) {
        console.error("Erro ao atualizar quantidade:", err);
        alert("Erro ao atualizar quantidade no servidor.");
        // Em caso de erro, recarregue o carrinho
        await carregarCarrinho();
      }
    } else {
      // Para carrinho local, atualize o localStorage
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      const carrinhoAtualizado = carrinhoLocal.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            quantidade: novaQuantidade,
            subtotal: i.preco * novaQuantidade
          };
        }
        return i;
      });
      
      localStorage.setItem('carrinho_local', JSON.stringify(carrinhoAtualizado));
      console.log("Carrinho local atualizado com sucesso");
    }
    
    setAtualizando(false);
  };

  // Função revisada para remover um item
  const removerItem = async (item) => {
    if (atualizando) return; // Evita múltiplos cliques durante exclusão
    
    console.log("Removendo item:", item.id);
    setAtualizando(true);
    
    // Primeiro atualize a interface para feedback imediato
    const novosItens = carrinho.filter(i => i.id !== item.id);
    setCarrinho(novosItens);
    setCarrinhoTotal(calcularTotal(novosItens));
    
    let usuario = JSON.parse(localStorage.getItem('usuarios'));
    if (Array.isArray(usuario)) {
      usuario = usuario[0];
    }
    
    if (usuario && usuario.id) {
      try {
        await axios.delete(`/carrinho/${item.id}`);
        console.log("Item removido do servidor com sucesso");
      } catch (err) {
        console.error("Erro ao remover item:", err);
        alert("Erro ao remover item do servidor.");
        // Em caso de erro, recarregue o carrinho
        await carregarCarrinho();
      }
    } else {
      // Para carrinho local, atualize o localStorage
      const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
      const carrinhoAtualizado = carrinhoLocal.filter(i => i.id !== item.id);
      
      localStorage.setItem('carrinho_local', JSON.stringify(carrinhoAtualizado));
      console.log("Carrinho local atualizado após remoção:", carrinhoAtualizado);
    }
    
    setAtualizando(false);
  };

  // Função para finalizar pedido - CORRIGIDA para definir status explicitamente
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
      // CORREÇÃO: Agora enviamos explicitamente o status como 'pendente'
      const response = await axios.post('/pedidos', {
        usuario_id: usuario.id,
        endereco: endereco,
        forma_pagamento: formaPagamento,
        status: 'pendente', // ← ADICIONADO: Define explicitamente o status
        itens: carrinho.map(item => ({
          produto_id: item.produto_id || item.id,
          quantidade: item.quantidade,
          preco: item.preco
        }))
      });

      console.log('Pedido criado com sucesso:', response.data);
      alert("Pedido finalizado com sucesso!");
      
      // Limpar carrinho no backend
      await axios.delete(`/carrinho/usuario/${usuario.id}`);
      
      // Limpar localStorage
      localStorage.removeItem('carrinho_completo');
      localStorage.removeItem('carrinho_local');
      
      // Atualizar estado local
      setCarrinho([]);
      setCarrinhoTotal(0);
      
      // Redirecionar para página de confirmação ou histórico de pedidos
      navigate('/pedidos');
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      console.error("Detalhes do erro:", error.response?.data);
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
                          disabled={atualizando}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="quantidade">{item.quantidade}</span>
                        <button
                          className="qty-btn"
                          onClick={() => atualizarQuantidade(item, item.quantidade + 1)}
                          disabled={atualizando}
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
                        disabled={atualizando}
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
              <span>R${FRETE_FIXO.toFixed(2)}</span>
            </div>
            <div className="resumo-item total">
              <span>Total:</span>
              <span>R$ {(carrinhoTotal + FRETE_FIXO).toFixed(2)}</span>
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

              <button 
                className="finalizar-compra-btn" 
                onClick={finalizarPedido}
                disabled={atualizando || carrinho.length === 0}
              >
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