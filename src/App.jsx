// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./assets/components/Navbar/Navbar.jsx";
import Bane from "./assets/components/Banner/Baner.jsx";
import NavBar from "./assets/components/Navbar2/navBar.jsx";
import Produtos from './assets/components/Categorias/Categorias';
import Login from './assets/components/Login/Login.jsx';
import Dashboard from "./assets/components/Tela-Admin/Dashboard.jsx";


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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
