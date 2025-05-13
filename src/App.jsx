import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Bane from "./assets/components/Banner/Baner.jsx";
import NavBar2 from "./assets/components/Navbar2/navBar.jsx";
import Produtos from './assets/components/Categorias/Categorias';

import Dashboard from "./assets/components/Tela-Admin/Dashboard.jsx";
import LoginCliente from "./assets/components/Tela-login-cliente/Login.jsx";
import CadastroCliente from "./assets/components/Cadastro/Cadastro.jsx";
import ProdutosAdmin from "./assets/components/Tela-Admin/Produtos.jsx";
import PedidosAdmin from "./assets/components/Tela-Admin/Pedidos.jsx";
import CategoriasAdmin from "./assets/components/Tela-Admin/Categorias.jsx";

import Hortifruti from './assets/components/Menu-Hamburguer/Hortifruti.jsx';
import LayoutComNavbar from './assets/components/LayoutPrincipal/LayoutPrincipal.jsx';
import Acougue from './assets/components/Menu-Hamburguer/Acougue.jsx';
import Bebidas from './assets/components/Menu-Hamburguer/Bebidas.jsx';
import Limpeza from './assets/components/Menu-Hamburguer/Limpeza.jsx';
import Carrinho from './assets/components/carrinho/carrinho.jsx';
import Pedidos from './assets/components/Pedidos_cliente/Pedidos_cliente.jsx';

// Componente Home com o conteúdo da página inicial
function Home() {
  return (
    <>
      <Bane />
      <NavBar2 />
      <Produtos />
    </>
  );
}

// Componente para proteger rotas administrativas
function RotaProtegida({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está logado e é um administrador
    const checkAdmin = () => {
      const usuarioStorage = localStorage.getItem('usuarios');
      if (usuarioStorage) {
        const usuario = JSON.parse(usuarioStorage);
        // Verificar se o usuário tem role de admin
        setIsAdmin(usuario.role === 'admin');
      }
      setLoading(false);
    };
    
    checkAdmin();
  }, []);
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Redirecionar para login se não for admin
  return isAdmin ? children : <Navigate to="/login" replace />;
}

// Componente para proteger rotas que exigem login de cliente
function RotaCliente({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está logado
    const checkLogin = () => {
      const usuarioStorage = localStorage.getItem('usuarios');
      setIsLoggedIn(!!usuarioStorage);
      setLoading(false);
    };
    
    checkLogin();
  }, []);
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Redirecionar para login se não estiver logado
  return isLoggedIn ? children : <Navigate to="/login-cliente" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas que usam o Navbar */}
        <Route element={<LayoutComNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:categoriaId" element={<Produtos />} />
          
          <Route path="/hortifruti" element={<Hortifruti />} />
          <Route path="/açougue" element={<Acougue />} />
          <Route path='/bebidas' element={<Bebidas />} />
          <Route path='/limpeza' element={<Limpeza />} />
          <Route path='/pedidos' element={<Pedidos />} />
          
          {/* Carrinho requer login */}
          <Route path='/carrinho' element={
            <RotaCliente>
              <Carrinho />
            </RotaCliente>
          } />
        </Route>

        {/* Rotas sem Navbar */}
     
        <Route path="/login-cliente" element={<LoginCliente />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />

        {/* Dashboard e suas rotas filhas (protegidas) */}
        <Route path="/dashboard" element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        }>
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="produtos" element={<ProdutosAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;