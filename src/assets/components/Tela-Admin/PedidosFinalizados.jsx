import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PedidosFinalizados = () => {
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPedidosFinalizados = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/pedidos');
        const finalizados = res.data.filter(p => p.status === 'finalizado');
        setPedidosFinalizados(finalizados);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pedidos finalizados:", error);
        setLoading(false);
      }
    };

    buscarPedidosFinalizados();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Pedidos Finalizados</h1>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Total (R$)</th>
                <th className="px-4 py-2 text-left">Itens</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFinalizados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                    Nenhum pedido finalizado encontrado.
                  </td>
                </tr>
              ) : (
                pedidosFinalizados.map((pedido) => (
                  <tr key={pedido.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{pedido.id}</td>
                    <td className="px-4 py-2">{pedido.cliente}</td>
                    <td className="px-4 py-2">{new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2">R$ {Number(pedido.total).toFixed(2)}</td>
                    <td className="px-4 py-2">{pedido.itens?.length || 0}</td>
                    <td className="px-4 py-2 text-center">
                      <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        onClick={() => window.alert(`Detalhes do pedido #${pedido.id}`)}
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PedidosFinalizados;