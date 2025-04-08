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
        const response = await fetch('http://localhost:5000/usuarios', {
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
      
    const novoUsuario = {
      nome: 'João da Silva',
      cpf: '12345678900',
      email: 'joao@email.com',
      senha: '123456',
      endereco: 'Rua ABC, 123',
      telefone: '21999999999',
      role: 'cliente'
    };
    
    cadastrarUsuario(novoUsuario);


    const Navbar = ({ usuario }) => {
      const [isOpen, setIsOpen] = useState(false);
    
      const toggleMenu = () => {
        setIsOpen((prev) => !prev);
      };
    
      return (
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
            {usuario ? (
              <div className="usuario-logado">
                <span>Bem-vindo, {usuario.nome}!</span>
                <button className="btn logout-btn">Sair</button>
              </div>
            ) : (
              <>
                <button className="btn login-btn">Login</button>
                <button className="btn cadastrar-btn">Cadastrar</button>
              </>
            )}
          </nav>
        </header>
      );
    };
    
  }

export default Navbar;