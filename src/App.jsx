import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./assets/components/Navbar/Navbar.jsx";
import Bane from "./assets/components/Banner/Baner.jsx";
import NavBar from "./assets/components/Navbar2/navBar.jsx";
import Produtos from './assets/components/Categorias/Categorias';
import Login from './assets/components/Login/Login.jsx';
import Dashboard from "./assets/components/Tela-Admin/Dashboard.jsx";
import LoginCliente from "./assets/components/Tela-login-cliente/Login.jsx"
import CadastroCliente from "./assets/components/Cadastro/Cadastro.jsx"
import ProdutosAdmin from "./assets/components/Tela-Admin/Produtos.jsx";
import PedidosAdmin from "./assets/components/Tela-Admin/Pedidos.jsx"
import CategoriasAdmin from "./assets/components/Tela-Admin/Categorias.jsx"
function Home() {
  return (
    <>
      <Navbar />
      <Bane />
      <NavBar />
      <Produtos />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-cliente" element={<LoginCliente />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        
        {/* DASHBOARD como rota pai */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="produtos" element={<ProdutosAdmin />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          {/* Pode adicionar mais rotas filhas aqui, tipo: */}
          {/* <Route path="pedidos" element={<Pedidos />} /> */}
          {/* <Route path="categorias" element={<CategoriasAdmin />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
