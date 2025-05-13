import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioId = 1; // Substitua pelo ID do usuário logado

  useEffect(() => {
    axios.get(`http://localhost:3001/pedidos/${usuarioId}`)
      .then((res) => {
        setPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar pedidos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.pedido_id} className="mb-6 border rounded p-4 shadow">
            <h2 className="text-lg font-semibold">Pedido #{pedido.pedido_id}</h2>
            <p><strong>Data:</strong> {new Date(pedido.data_pedido).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {pedido.status}</p>
            <p><strong>Total:</strong> R$ {pedido.total?.toFixed(2) || 'N/A'}</p>

            <h3 className="mt-3 font-medium">Itens:</h3>
            <ul className="list-disc list-inside">
              {pedido.itens.map((item, idx) => (
                <li key={idx}>
                  {item.nome} - {item.quantidade}x R$ {item.preco.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Pedidos;
