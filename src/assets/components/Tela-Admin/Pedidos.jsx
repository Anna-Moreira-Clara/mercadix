// Pedidos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTruck, FaExclamationCircle } from 'react-icons/fa';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    carregarPedidos();
    
    // Configurar polling para buscar novos pedidos a cada 30 segundos
    const intervalId = setInterval(() => {
      carregarPedidos();
    }, 30000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await axios.get('/pedidos');
      setPedidos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setLoading(false);
    }
  };

  const atualizarStatusPedido = async (pedidoId, novoStatus) => {
    try {
      await axios.put(`/pedidos/${pedidoId}/status`, { status: novoStatus });
      
      // Atualizar a lista de pedidos localmente
      setPedidos(pedidos.map(pedido => 
        pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      ));
      
      alert(`Pedido #${pedidoId} atualizado para: ${novoStatus}`);
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      alert("Erro ao atualizar status do pedido. Tente novamente.");
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pendente':
        return 'status-pendente';
      case 'em_preparo':
        return 'status-preparo';
      case 'despachado':
        return 'status-despachado';
      case 'entregue':
        return 'status-entregue';
      case 'cancelado':
        return 'status-cancelado';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente':
        return <FaExclamationCircle />;
      case 'em_preparo':
        return <FaCheck />;
      case 'despachado':
        return <FaTruck />;
      case 'entregue':
        return <FaCheck />;
      case 'cancelado':
        return <FaExclamationCircle />;
      default:
        return null;
    }
  };

  const getNomeStatusPedido = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_preparo':
        return 'Em preparo';
      case 'despachado':
        return 'Despachado';
      case 'entregue':
        return 'Entregue';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filtrarPedidos = () => {
    if (filtroStatus === 'todos') {
      return pedidos;
    }
    return pedidos.filter(pedido => pedido.status === filtroStatus);
  };

  const pedidosFiltrados = filtrarPedidos();

  if (loading) {
    return (
      <div className="pedidos-container">
        <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
        <div className="loading">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      <h1 className="text-2xl font-bold">Gerenciamento de Pedidos</h1>
      
      <div className="filtros-container">
        <label htmlFor="filtro-status">Filtrar por status:</label>
        <select 
          id="filtro-status" 
          value={filtroStatus} 
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendentes</option>
          <option value="em_preparo">Em preparo</option>
          <option value="despachado">Despachados</option>
          <option value="entregue">Entregues</option>
          <option value="cancelado">Cancelados</option>
        </select>
        <button className="btn-atualizar" onClick={carregarPedidos}>
          Atualizar lista
        </button>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="sem-pedidos">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="lista-pedidos">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className={`pedido-card ${getStatusClass(pedido.status)}`}>
              <div className="pedido-header">
                <div className="pedido-id">
                  <h3>Pedido #{pedido.id}</h3>
                  <span className={`status-badge ${getStatusClass(pedido.status)}`}>
                    {getStatusIcon(pedido.status)} {getNomeStatusPedido(pedido.status)}
                  </span>
                </div>
                <div className="pedido-data">
                  {formatarData(pedido.data_criacao)}
                </div>
              </div>
              
              <div className="pedido-cliente">
                <div className="cliente-info">
                  <strong>Cliente:</strong> {pedido.usuario.nome}
                </div>
                <div className="cliente-endereco">
                  <strong>Endereço:</strong> {pedido.endereco_entrega}
                </div>
                <div className="forma-pagamento">
                  <strong>Pagamento:</strong> {pedido.forma_pagamento}
                </div>
              </div>
              
              <div className="pedido-itens">
                <h4>Itens do pedido:</h4>
                <table className="itens-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.itens.map((item, index) => (
                      <tr key={index}>
                        <td>{item.produto.nome}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {parseFloat(item.preco).toFixed(2)}</td>
                        <td>R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pedido-valor">
                <div className="subtotal">
                  <span>Subtotal:</span>
                  <span>R$ {pedido.valor_total.toFixed(2)}</span>
                </div>
                <div className="frete">
                  <span>Frete:</span>
                  <span>R$ {pedido.valor_frete.toFixed(2)}</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>R$ {(pedido.valor_total + pedido.valor_frete).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="acoes-pedido">
                {pedido.status === 'pendente' && (
                  <button 
                    className="btn-preparar"
                    onClick={() => atualizarStatusPedido(pedido.id, 'em_preparo')}
                  >
                    Iniciar Preparo
                  </button>
                )}
                
                {pedido.status === 'em_preparo' && (
                  <button 
                    className="btn-despachar"
                    onClick={() => atualizarStatusPedido(pedido.id, 'despachado')}
                  >
                    Despachar Pedido
                  </button>
                )}
                
                {pedido.status === 'despachado' && (
                  <button 
                    className="btn-finalizar"
                    onClick={() => atualizarStatusPedido(pedido.id, 'entregue')}
                  >
                    Marcar como Entregue
                  </button>
                )}
                
                {(pedido.status === 'pendente' || pedido.status === 'em_preparo') && (
                  <button 
                    className="btn-cancelar"
                    onClick={() => atualizarStatusPedido(pedido.id, 'cancelado')}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pedidos;