import React from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";
import { useState } from "react";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((prev) => !prev);
    };

    const cadastrarUsuario = async (usuario) => {
      try {
        const response = await fetch('http://localhost:3001/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
    
        const data = await response.json();
        if (response.ok) {
          alert('Usuário cadastrado com sucesso!');
        } else {
          alert('Erro ao cadastrar: ' + data.error);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };
      

    return(
       <header className="header">
        <div className="container-logo">
        <a href="/" className="redirect-link">
        <img src={Logo} alt="logoo" className="logo" />
        </a>
        </div>


        <div className="pesquisa">
        <button className="botao-menu" onClick={toggleMenu}>☰</button>

      {isOpen && (
        <div id="menu-dropdown" className="menu-dropdown">
          {/* Conteúdo do menu aqui */}
          <ul>
                <li><a href="/">Hortifruti</a></li>
                <li><a href="/">Açogue</a></li>
                <li><a href="/">Bebidas</a></li>
                <li><a href="/">Limpeza</a></li>
          </ul>
        </div>
      )}    
        
        <input
            type="text"
            className="search-bar"
            placeholder="Pesquisar Produtos..." />
          </div>  

        <nav className="navbar">
            
        <a href="/login-cliente">
            <button className="btn login-btn" >Login</button>
            </a>
            <a href="/cadastro-cliente">
            <button className="btn cadastrar-btn">Cadastrar</button>
            </a>
        </nav>

       </header>
    )
}

export default Navbar;