import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pedidos.css';

const Pedidos = () => {
  const FRETE_FIXO = 10.0;
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    axios.get('http://localhost:5000/pedidos')
      .then((res) => {
        setPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar pedidos:', err.response?.data || err.message);
        setErro('Erro ao buscar pedidos. Tente novamente mais tarde.');
        setLoading(false);
      });
  };

  const atualizarStatusPedido = async (id, novoStatus) => {
    try {
      console.log(`Tentando atualizar pedido ${id} para status ${novoStatus}`);
      
      const response = await axios.put(`http://localhost:5000/pedidos/${id}/status`, { 
        status: novoStatus 
      });
      
      console.log('Resposta da atualização:', response.data);
      
      // Atualiza o estado local
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.pedido_id === id ? { ...pedido, status: novoStatus } : pedido
        )
      );
      
      alert(`Pedido #${id} atualizado para ${novoStatus} com sucesso!`);
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido #${id}:`, error);
      console.error('URL que falhou:', error.config?.url);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      alert(`Erro ao atualizar o pedido: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) return <p>Carregando pedidos...</p>;
  if (erro) return <p className="text-red-500">{erro}</p>;

  return (
    <div className="pedidos-container">
      <h1 className="text-2xl font-bold mb-4">Todos os Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="sem-pedidos">Nenhum pedido encontrado.</div>
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <div key={pedido.pedido_id} className={`pedido-card status-${pedido.status.toLowerCase()}`}>
              <div className="pedido-header">
                <div className="pedido-id">
                  <h3>Pedido #{pedido.pedido_id}</h3>
                  <span className="status-badge">{pedido.status}</span>
                </div>
                <div className="pedido-data">
                  {new Date(pedido.data_pedido).toLocaleDateString()}
                </div>
              </div>

              <div className="pedido-cliente">
                <div className="cliente-info"><strong>Cliente:</strong> {pedido.nome_usuario} (ID: {pedido.usuario_id})</div>
              </div>

              <div className="pedido-itens">
                <h4>Itens:</h4>
                <table className="itens-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.itens && pedido.itens.length > 0 ? (
                      pedido.itens.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.nome_produto}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {parseFloat(item.preco).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-gray-500">Sem itens neste pedido.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pedido-valor">
                <div className="frete">
                  <span>Frete:</span>
                  <span>R${FRETE_FIXO.toFixed(2)}</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>R$ {Number(pedido.total + FRETE_FIXO).toFixed(2)}</span>
                </div>
              </div>

              <div className="acoes-pedido">
                


                {pedido.status === "pendente" && (
                  <button
                    className="btn-finalizar"
                    onClick={() => atualizarStatusPedido(pedido.pedido_id, "finalizado")}
                  >
                    Marcar como Finalizado
                  </button>
                )}

                {(pedido.status === "entregue" || pedido.status === "cancelado") && (
                  <span className="status-final">
                    Pedido {pedido.status === "entregue" ? "finalizado" : "cancelado"}
                  </span>
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