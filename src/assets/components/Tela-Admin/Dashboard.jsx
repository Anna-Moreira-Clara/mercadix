import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, Rocket, ChevronRight, Grid, Settings, FileText, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import "./dash.css";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [mostrarGrafico, setMostrarGrafico] = useState(false); // ⬅️ NOVO

  useEffect(() => {
    setModalAberto(false);
  }, [location.pathname]);

  const agruparPorMes = (pedidos) => {
    const mapa = {};
    pedidos.forEach(pedido => {
      const data = new Date(pedido.data_pedido);
      const ano = data.getFullYear();
      const mes = data.getMonth();
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;
      mapa[chave] = (mapa[chave] || 0) + Number(pedido.total);
    });

    return Object.entries(mapa)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([chave, total]) => {
        const [ano, mes] = chave.split('-');
        const data = new Date(ano, mes);
        const label = data.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
        return { mes: label, total };
      });
  };

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const buscarPedidos = async () => {
        try {
          const res = await axios.get('http://localhost:5000/pedidos');
          const pendentes = res.data.filter(p => p.status === 'pendente');
          const finalizados = res.data.filter(p => p.status === 'finalizado');
          setPedidosPendentes(pendentes.length);
          setPedidosFinalizados(finalizados);
          const dados = agruparPorMes(finalizados);
          setDadosGrafico(dados);
        } catch (error) {
          console.error("Erro ao buscar pedidos:", error);
        }
      };

      buscarPedidos();
      const interval = setInterval(buscarPedidos, 10000);
      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  const handleAbrirModalPedidosFinalizados = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const isDashboardHome = location.pathname === '/dashboard';

  const totalVendasMensal = pedidosFinalizados.reduce((acc, p) => acc + Number(p.total), 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-60 bg-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <div className="bg-white rounded-full p-2 flex items-center justify-center">
            <Rocket className="text-blue-600 h-5 w-5" />
          </div>
          <div className="font-bold text-xl">MERCADIX ADMIN</div>
        </div>
        <nav className="flex-1">
          <Link to="/dashboard" className='bota'>
            <div className="p-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-700 rounded text-white">
                <Grid className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </div>
          </Link>
          <div className="px-4 mt-2 mb-2">
            <p className="text-xs text-blue-300 px-4 mb-2">INTERFACE</p>
            <Link to="pedidos" className='bota'>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Pedidos</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
            <Link to="produtos" className='bota'>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Produtos</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
            <Link to="categorias" className='bota'>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Categorias</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b flex items-center justify-between px-6 py-4">
          <a href="/"><button className="botao">Acessar Site</button></a>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">...</span>
              <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {isDashboardHome && (
            <>
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div
                  className="bg-white rounded border-l-4 border-green-500 shadow flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setMostrarGrafico(!mostrarGrafico)}
                >
                  <div>
                    <p className="text-xs font-bold text-green-500 pddfinal">VENDAS MENSAL</p>
                    <p className="text-2xl font-bold text-gray-700">R$ {totalVendasMensal.toFixed(2)}</p>
                  </div>
                  <div className="text-gray-300">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>

                <div 
                  className="bg-white rounded border-l-4 border-blue-500 shadow flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={handleAbrirModalPedidosFinalizados}
                >
                  <div>
                    <p className="text-xs font-bold text-blue-500">PEDIDOS FINALIZADOS</p>
                    <p className="text-2xl font-bold text-gray-700">{pedidosFinalizados.length}</p>
                  </div>
                  <div className="text-gray-300">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>

                <div className="bg-white rounded border-l-4 border-yellow-500 shadow flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs font-bold text-yellow-500">PEDIDOS PENDENTES</p>
                    <p className="text-2xl font-bold text-gray-700">{pedidosPendentes}</p>
                  </div>
                  <div className="text-gray-300">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>
              </div>

              {mostrarGrafico && ( // ⬅️ SÓ MOSTRA O GRÁFICO QUANDO ATIVADO
                <div className="bg-white rounded shadow p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Vendas Mensais</h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" stroke="#8884d8" />
                      <YAxis stroke="#8884d8" />
                      <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="total" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          <Outlet />

          {modalAberto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleFecharModal}>
              <div className="bg-white rounded-lg shadow-lg w-4/5 max-h-4/5 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b flex justify-between items-center bg-blue-600 text-white">
                  <h2 className="text-xl font-bold">Pedidos Finalizados</h2>
                  <button onClick={handleFecharModal} className="bataoexcluir">
                    <X className="bo" />
                  </button>
                </div>
                
                <div className="p-6 overflow-auto flex-1">
                  {carregandoPedidos ? (
                    <div className="text-center py-4">Carregando...</div>
                  ) : (
                    <div className="bg-white rounded shadow overflow-x-auto">
                      <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-600 uppercase bg-blue-100">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Total (R$)</th>
                            <th className="px-4 py-3">Itens</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pedidosFinalizados.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                Nenhum pedido finalizado encontrado.
                              </td>
                            </tr>
                          ) : (
                            pedidosFinalizados.map((pedido) => (
                              <tr key={pedido.id} className="hover:bg-blue-50 transition duration-150">
                                <td className="px-4 py-3 font-medium">{pedido.pedido_id}</td>
                                <td className="px-4 py-3">{pedido.nome_usuario || pedido.cliente}</td>
                                <td className="px-4 py-3">{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</td>
                                <td className="px-4 py-3">R$ {Number(pedido.total).toFixed(2)}</td>
                                <td className="px-4 py-3">{pedido.itens?.length || 0}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
