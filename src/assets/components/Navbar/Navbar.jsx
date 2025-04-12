import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';

// Configure a base URL para todas as requisições
axios.defaults.baseURL = 'http://localhost:5000';

const Navbar = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        endereco: '',
        telefone: '',
        role: 'cliente'
    });

    const [loginData, setLoginData] = useState({
        email: '',
        senha: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Verifica se o usuário está logado ao iniciar
    useEffect(() => {
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            setUsuarioLogado(JSON.parse(usuarioStorage));
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleRegisterModal = () => {
        setShowRegisterModal(!showRegisterModal);
        setMessage('');
    };

    const toggleLoginModal = () => {
        setShowLoginModal(!showLoginModal);
        setLoginMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/usuarios', formData);
            setMessage(response.data.message);
            setFormData({
                nome: '',
                cpf: '',
                email: '',
                senha: '',
                endereco: '',
                telefone: '',
                role: 'cliente'
            });

            setTimeout(() => {
                if (response.data.message.includes('sucesso')) {
                    toggleRegisterModal();
                }
            }, 2000);

        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setMessage(error.response?.data?.error || 'Erro ao cadastrar usuário.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginMessage('');

        try {
            const response = await axios.get('/usuarios', { params: loginData });
            const usuario = response.data;

            localStorage.setItem('usuario', JSON.stringify(usuario));
            setUsuarioLogado(usuario);
            setLoginMessage('Login realizado com sucesso!');

            setTimeout(() => {
                toggleLoginModal();
                navigate("/", "/hortifruti");
            }, 1500);

        } catch (error) {
            console.error('Erro ao logar:', error);
            setLoginMessage(error.response?.data?.message || 'Email ou senha incorretos');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        setUsuarioLogado(null);
        navigate('/');
    };

    const [showCartMenu, setShowCartMenu] = useState(false);

const toggleCartMenu = () => {
    setShowCartMenu(prev => !prev);
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
                    <div className="menu-dropdown">
                        <ul>
                            <li><a href="/hortifruti">Hortifruti</a></li>
                            <li><a href="/acougue">Açougue</a></li>
                            <li><a href="/bebidas">Bebidas</a></li>
                            <li><a href="/">Limpeza</a></li>
                        </ul>
                    </div>
                )}
                <input type="text" className="search-bar" placeholder="Pesquisar Produtos..." />
            </div>

            <nav className="navbar">
            <button className="btn cart-btn" onClick={toggleCartMenu}>
    <FaShoppingCart size={20} />
    <span className="cart-count">3</span> {/* pode ser dinâmico */}
</button>

{showCartMenu && (
    <div className="cart-menu">
        <button className="close-cart" onClick={toggleCartMenu}>×</button>
        <h3>Meu Carrinho</h3>
        <ul className="cart-items">
            {/* Exemplo fixo, pode ser dinâmico */}
            <li>Maçã - 2 unidades</li>
            <li>Arroz - 1 pacote</li>
            <li>Sabonete - 3 unidades</li>
        </ul>
        <button className="btn finalizar-btn">Finalizar Compra</button>
    </div>
)}


    {usuarioLogado ? (
        <div className="usuario-logado">
            <button className="btn-usuario">Olá, {usuarioLogado.nome}</button>
            <button className="btn sair-btn" onClick={handleLogout}>Sair</button>
        </div>
    ) : (
        <>
            <button className="btn login-btn" onClick={toggleLoginModal}>Login</button>
            <button className="btn cadastrar-btn" onClick={toggleRegisterModal}>Cadastrar</button>
        </>
    )}
</nav>

            {/* Modal de Cadastro */}
            {showRegisterModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={toggleRegisterModal}>×</button>
                        <h2>Cadastro de Cliente</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Campos de cadastro... */}
                            {/* Use seus inputs já existentes aqui */}
                            <div className="form-group">
                                <label>Nome:</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>CPF:</label>
                                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Senha:</label>
                                <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Endereço:</label>
                                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Telefone:</label>
                                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required />
                            </div>
                            {message && <p>{message}</p>}
                            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Cadastrar'}</button>
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
                                <label>Email:</label>
                                <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
                            </div>
                            <div className="form-group">
                                <label>Senha:</label>
                                <input type="password" name="senha" value={loginData.senha} onChange={handleLoginChange} required />
                            </div>
                            {loginMessage && <p>{loginMessage}</p>}
                            <button type="submit" disabled={loginLoading}>{loginLoading ? 'Entrando...' : 'Entrar'}</button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
