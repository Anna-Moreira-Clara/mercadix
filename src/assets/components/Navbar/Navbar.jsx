import React from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";
import { useState } from "react";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((prev) => !prev);
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
            

            <button className="btn login-btn">Login</button>
            <button className="btn cadastrar-btn">Cadastrar</button>
        </nav>

       </header>
    )
}

export default Navbar;