import React, { useState } from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);

  return (
    <>
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
              <ul>
                <li><a href="/">Hortifruti</a></li>
                <li><a href="/">Açougue</a></li>
                <li><a href="/">Bebidas</a></li>
                <li><a href="/">Limpeza</a></li>
              </ul>
            </div>
          )}

          <input
            type="text"
            className="search-bar"
            placeholder="Pesquisar Produtos..."
          />
        </div>

        <nav className="navbar">
          <button className="btn login-btn" onClick={toggleLoginModal}>Login</button>
          <button className="btn cadastrar-btn" onClick={toggleRegisterModal}>Cadastrar</button>
        </nav>
      </header>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <div className="modal-buttons">
              <button>Entrar</button>
              <button onClick={toggleLoginModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Cadastrar</h2>
            <input type="text" placeholder="Nome" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <div className="modal-buttons">
              <button>Cadastrar</button>
              <button onClick={toggleRegisterModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
