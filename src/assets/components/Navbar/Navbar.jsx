import React, { useState } from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";
import axios from 'axios';
import "../Cadastro/cadastro.css";

// Configure a base URL para todas as requisições
axios.defaults.baseURL = 'http://localhost:5000';

const Navbar = () => {
    // Estado para o menu dropdown
    const [isOpen, setIsOpen] = useState(false);
    
    // Estados para o modal de cadastro
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: "",
        email: '',
        senha: '',
        endereco: '',
        telefone: '',
        role: 'cliente' // Valor padrão
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleRegisterModal = () => {
        setShowRegisterModal(!showRegisterModal);
        setMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            // Conectando com a rota definida em usuarios.js
            const response = await axios.post('/usuarios', formData);
            
            setMessage(response.data.message);
            // Resetar o formulário após o sucesso
            setFormData({
                nome: '',
                cpf: '',
                email: '',
                senha: '',
                endereco: '',
                telefone: '',
                role: 'cliente'
            });
            
            // Opcional: fechar o modal após algum tempo
            setTimeout(() => {
                if (response.data.message.includes('sucesso')) {
                    toggleRegisterModal();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setMessage(
                error.response?.data?.error || 
                'Erro ao cadastrar usuário. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Estado do modal de login
const [showLoginModal, setShowLoginModal] = useState(false);
const [loginData, setLoginData] = useState({ email: '', senha: '' });
const [loginMessage, setLoginMessage] = useState('');
const [loginLoading, setLoginLoading] = useState(false);

const toggleLoginModal = () => {
  setShowLoginModal(!showLoginModal);
  setLoginMessage('');
};

const handleLoginChange = (e) => {
  const { name, value } = e.target;
  setLoginData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginLoading(true);
  setLoginMessage('');

  try {
    const response = await axios.post('/usuarios', loginData);

    if (response.data && response.data.usuario) {
      setLoginMessage("Login realizado com sucesso!");

      // Se quiser redirecionar por role:
      if (response.data.usuario.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } else {
      setLoginMessage("Credenciais inválidas.");
    }
  } catch (error) {
    setLoginMessage("Erro ao tentar logar. Verifique as credenciais.");
  } finally {
    setLoginLoading(false);
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
            <button className="btn login-btn" onClick={toggleLoginModal}>Login</button>
                <button className="btn cadastrar-btn" onClick={toggleRegisterModal}>Cadastrar</button>
            </nav>

            {/* Modal de Cadastro */}
            {showRegisterModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={toggleRegisterModal}>×</button>
                        <h2>Cadastro de Cliente</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nome">Nome Completo</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="cpf">CPF</label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    required
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="senha">Senha</label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="endereco">Endereço</label>
                                <input
                                    type="text"
                                    id="endereco"
                                    name="endereco"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="telefone">Telefone</label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    required
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            
                            {message && (
                                <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}
                            
                            <div className="form-buttons">
                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={loading}
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={toggleRegisterModal}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Login */}
{showLoginModal && (
  <div className="modal-overlay">
    <div className="modal">
      <button className="close-btn" onClick={toggleLoginModal}>×</button>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loginSenha">Senha</label>
          <input
            type="password"
            id="loginSenha"
            name="senha"
            value={loginData.senha}
            onChange={handleLoginChange}
            required
          />
        </div>

        {loginMessage && (
          <div className={`message ${loginMessage.includes('sucesso') ? 'success' : 'error'}`}>
            {loginMessage}
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="submit-btn" disabled={loginLoading}>
            {loginLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <button type="button" className="cancel-btn" onClick={toggleLoginModal}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </header>
    );
};

export default Navbar;