import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { User, Rocket, ChevronRight, Grid, Settings, FileText } from 'lucide-react';
import "./dash.css";

const AdminDashboard = () => {
  const location = useLocation();
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [pedidosFinalizados, setPedidosFinalizados] = useState([]);
  const [mostrarPedidosFinalizados, setMostrarPedidosFinalizados] = useState(false);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const buscarPedidosPendentes = async () => {
        try {
          const res = await axios.get('http://localhost:5000/pedidos');
          const pendentes = res.data.filter(p => p.status === 'pendente');
          setPedidosPendentes(pendentes.length);
        } catch (error) {
          console.error("Erro ao buscar pedidos pendentes:", error);
        }
      };

      buscarPedidosPendentes();
      const interval = setInterval(buscarPedidosPendentes, 10000); // Atualiza a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  const handleMostrarPedidosFinalizados = async () => {
    setMostrarPedidosFinalizados(true);
    setCarregandoPedidos(true);
    try {
      const res = await axios.get('http://localhost:5000/pedidos');
      const finalizados = res.data.filter(p => p.status === 'finalizado');
      setPedidosFinalizados(finalizados);
    } catch (error) {
      console.error("Erro ao buscar pedidos finalizados:", error);
    } finally {
      setCarregandoPedidos(false);
    }
  };

  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <div className="bg-white rounded-full p-2 flex items-center justify-center">
            <Rocket className="text-blue-600 h-5 w-5" />
          </div>
          <div className="font-bold text-xl">MERCADIX ADMIN</div>
        </div>

        {/* Navegação */}
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

            <div className='bota'>
              <div 
                className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer"
                onClick={() => {
                  handleMostrarPedidosFinalizados();
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span>Pedidos Finalizados</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

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

      {/* Conteúdo Principal */}
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
          {/* Cards aparecem somente na raiz de /dashboard */}
          {isDashboardHome && !mostrarPedidosFinalizados && (
            <div className="grid grid-cols-4 gap-6 mb-6">
              {/* VENDAS MENSAL */}
              <div className="bg-white rounded border-l-4 border-green-500 shadow flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-bold text-green-500 pddfinal">VENDAS MENSAL</p>
                  <p className="text-2xl font-bold text-gray-700">R$000,00</p>
                </div>
                <div className="text-gray-300">
                  <FileText className="h-12 w-12" />
                </div>
              </div>

              {/* PEDIDOS FINALIZADOS */}
              <div className="bg-white rounded border-l-4 border-green-500 shadow p-4 col-span-2">
                <div>
                  <button
                    className="text-xs font-bold text-green-500 pddfinal mb-2"
                    onClick={handleMostrarPedidosFinalizados}
                  >
                    PEDIDOS FINALIZADOS
                  </button>
                </div>
              </div>

              {/* PEDIDOS PENDENTES */}
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
          )}

          {mostrarPedidosFinalizados ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciar Pedidos Finalizados</h1>
                <button 
                  onClick={() => setMostrarPedidosFinalizados(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Voltar ao Dashboard
                </button>
              </div>

              {carregandoPedidos ? (
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
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;