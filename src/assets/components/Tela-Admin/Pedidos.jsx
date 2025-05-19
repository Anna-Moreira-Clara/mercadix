import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pedidos.css'; // Importando o CSS

const Pedidos = () => {
  const FRETE_FIXO = 10.0;
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/pedidos')
      .then((res) => {
        console.log("📦 Dados recebidos:", res.data);
        setPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar pedidos:', err.response?.data || err.message);
        setErro('Erro ao buscar pedidos. Tente novamente mais tarde.');
        setLoading(false);
      });
  }, []);

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
                  <button className="btn-preparar">Marcar como Em Preparo</button>
                )}
                {pedido.status === "preparo" && (
                  <button className="btn-despachar">Marcar como Despachado</button>
                )}
                {pedido.status === "despachado" && (
                  <button className="btn-finalizar">Finalizar Pedido</button>
                )}
                {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
                  <button className="btn-cancelar">Cancelar Pedido</button>
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
