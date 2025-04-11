import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Bane from "./assets/components/Banner/Baner.jsx";
import NavBar2 from "./assets/components/Navbar2/navBar.jsx";
import Produtos from './assets/components/Categorias/Categorias';
import Login from './assets/components/Login/Login.jsx';
import Dashboard from "./assets/components/Tela-Admin/Dashboard.jsx";
import LoginCliente from "./assets/components/Tela-login-cliente/Login.jsx";
import CadastroCliente from "./assets/components/Cadastro/Cadastro.jsx";
import ProdutosAdmin from "./assets/components/Tela-Admin/Produtos.jsx";
import PedidosAdmin from "./assets/components/Tela-Admin/Pedidos.jsx";
import CategoriasAdmin from "./assets/components/Tela-Admin/Categorias.jsx";
import Estoque from './assets/components/Tela-Admin/Estoque.jsx';
import Hortifruti from './assets/components/Menu-Hamburguer/Hortifruti.jsx';
import LayoutComNavbar from './assets/components/LayoutPrincipal/LayoutPrincipal.jsx'; // novo layout
import Acougue from './assets/components/Menu-Hamburguer/Acougue.jsx';

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

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas que usam o Navbar */}
        <Route element={<LayoutComNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/hortifruti" element={<Hortifruti />} />
          <Route path="/acougue" element={<Acougue />} />
        
        </Route>

        {/* Rotas sem Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-cliente" element={<LoginCliente />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />

        {/* Dashboard e suas rotas filhas (sem Navbar) */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="produtos" element={<ProdutosAdmin />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="estoque" element={<Estoque />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
