import React from 'react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { User, Rocket, ChevronRight, Grid, Settings, FileText } from 'lucide-react';
import "./dash.css";

const AdminDashboard = () => {
  const location = useLocation();

  // Verifica se está na raiz do dashboard (exatamente "/dashboard")
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
          <Link to="/dashboard" className='bot'>
            <div className="p-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-700 rounded text-white">
                <Grid className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </div>
          </Link>

          <div className="px-4 mt-2 mb-2">
            <p className="text-xs text-blue-300 px-4 mb-2">INTERFACE</p>

            <Link to="pedidos" className='bot'>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Pedidos</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>

            <Link to="produtos" className='bot'>
              <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  <span>Produtos</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>

            <Link to="categorias" className='bot'>
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
          {isDashboardHome && (
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <button className="btn mais-vendidos-btn">Mais vendidos</button>
              </div>

              <div className="bg-white rounded border-l-4 border-green-500 shadow flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-bold text-green-500">VENDAS MENSAL</p>
                  <p className="text-2xl font-bold text-gray-700">R$000,00</p>
                </div>
                <div className="text-gray-300">
                  <FileText className="h-12 w-12" />
                </div>
              </div>

              

              <div className="bg-white rounded border-l-4 border-yellow-500 shadow flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-bold text-yellow-500">PEDIDOS PENDENTES</p>
                  <p className="text-2xl font-bold text-gray-700">0</p>
                </div>
                <div className="text-gray-300">
                  <FileText className="h-12 w-12" />
                </div>
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
