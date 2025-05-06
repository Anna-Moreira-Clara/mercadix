import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Logo from "../Navbar/logo.jpg";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

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
        const usuarioStorage = localStorage.getItem('usuarios');
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

            if (!response.data || response.data.error) {
                throw new Error(response.data?.error || 'Erro ao fazer login');
            }

            const usuario = response.data;

            localStorage.setItem('usuarios', JSON.stringify(usuario));
            setUsuarioLogado(usuario);    
            setUsuarioLogado({ nome: usuario });
            console.log("Usuário logado:", usuario.nome);
            

            // Transfere o carrinho local para o backend após login
            const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local'));
            if (carrinhoLocal && carrinhoLocal.length > 0) {
                for (const item of carrinhoLocal) {
                    try {
                        await axios.post('/carrinho', {
                            usuario_id: usuario.id,
                            produto_id: item.id,
                            quantidade: item.quantidade
                        });
                    } catch (err) {
                        console.error('Erro ao transferir item do carrinho:', err);
                    }
                }
                localStorage.removeItem('carrinho_local');
            }

            setLoginMessage('Login realizado com sucesso!');
            carregarCarrinho();

            setTimeout(() => {
                toggleLoginModal();
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error('Erro ao logar:', error);
            setLoginMessage(error.message || 'Email ou senha incorretos');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuarios');
        setUsuarioLogado(null);
        setCarrinho([]);
        navigate('/');
    };

    const [showCartMenu, setShowCartMenu] = useState(false);
    const [carrinho, setCarrinho] = useState([]);
    const [carrinhoTotal, setCarrinhoTotal] = useState(0);

    const toggleCartMenu = () => {
        setShowCartMenu(prev => !prev);
        carregarCarrinho();
    };

    const carregarCarrinho = async () => {
        let usuario = JSON.parse(localStorage.getItem('usuarios'));

        // CORREÇÃO: Se for array, pega o primeiro usuário
        if (Array.isArray(usuario)) {
            usuario = usuario[0];
        }

        if (usuario) {
            try {
                const res = await axios.get(`/carrinho/${usuario.id}`);
                setCarrinho(res.data);
                calcularTotal(res.data);
            } catch (err) {
                console.error("Erro ao buscar carrinho:", err);
            }
        } else {
            const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
            setCarrinho(carrinhoLocal);
            calcularTotal(carrinhoLocal);
        }
    };

    const calcularTotal = (itens) => {
        const total = itens.reduce((acc, item) => acc + parseFloat(item.subtotal || item.preco * item.quantidade || 0), 0);
        setCarrinhoTotal(total);
    };

    // Função para atualizar quantidade de um item no carrinho
    const atualizarQuantidade = async (item, novaQuantidade) => {
        if (novaQuantidade <= 0) {
            removerItem(item);
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('usuarios'));

        if (usuario) {
            try {
                await axios.put(`/carrinho/${item.id}`, { quantidade: novaQuantidade });
                carregarCarrinho();
            } catch (err) {
                console.error("Erro ao atualizar quantidade:", err);
            }
        } else {
            const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
            const itemIndex = carrinhoLocal.findIndex(i => i.id === item.id);

            if (itemIndex !== -1) {
                carrinhoLocal[itemIndex].quantidade = novaQuantidade;
                carrinhoLocal[itemIndex].subtotal = carrinhoLocal[itemIndex].preco * novaQuantidade;
                localStorage.setItem('carrinho_local', JSON.stringify(carrinhoLocal));
                setCarrinho(carrinhoLocal);
                calcularTotal(carrinhoLocal);
            }
        }
    };

    // Função para remover um item do carrinho
    const removerItem = async (item) => {
        const usuario = JSON.parse(localStorage.getItem('usuarios'));

        if (usuario) {
            try {
                await axios.delete(`/carrinho/${item.id}`);
                carregarCarrinho();
            } catch (err) {
                console.error("Erro ao remover item:", err);
            }
        } else {
            const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
            const newCarrinho = carrinhoLocal.filter(i => i.id !== item.id);
            localStorage.setItem('carrinho_local', JSON.stringify(newCarrinho));
            setCarrinho(newCarrinho);
            calcularTotal(newCarrinho);
        }
    };
    //o
    // Função para limpar carrinho
    const limparCarrinho = async () => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    
        if (usuarios && Array.isArray(usuarios) && usuarios.length > 0) {
            const usuario = usuarios[0]; // Pegando o primeiro usuário do array
    
            try {
                await axios.delete(`/carrinho/usuario/${usuario.id}`);
                setCarrinho([]);
                setCarrinhoTotal(0);
            } catch (err) {
                console.error("Erro ao limpar carrinho:", err);
            }
        } else {
            // Se não estiver logado, limpa o carrinho local
            localStorage.removeItem('carrinho_local');
            setCarrinho([]);
            setCarrinhoTotal(0);
        }
    };
    

    // Função para finalizar compra
    const finalizarCompra = async () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
    
        let usuario = JSON.parse(localStorage.getItem('usuarios'));
    
        if (Array.isArray(usuario)) {
            usuario = usuario[0];
        }
    
        if (!usuario) {
            alert("Faça login para finalizar a compra!");
            toggleLoginModal();
            return;
        }
    
        try {
            await axios.post('/pedidos', {
                usuario_id: usuario.id,
                itens: carrinho.map(item => ({
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    preco: item.preco
                }))
            });
    
            alert("Compra finalizada com sucesso!");
            setCarrinho([]);
            setCarrinhoTotal(0);
        } catch (error) {
            console.error("Erro ao finalizar compra:", error);
            alert("Erro ao finalizar compra.");
        }
    };
    

    // Carregar o carrinho ao iniciar o componente e quando o usuário logado mudar
    useEffect(() => {
        carregarCarrinho();

        // Adicionar listener para atualização do carrinho de outros componentes
        const handleCarrinhoAtualizado = () => {
            carregarCarrinho();
        };

        window.addEventListener('carrinhoAtualizado', handleCarrinhoAtualizado);

        return () => {
            window.removeEventListener('carrinhoAtualizado', handleCarrinhoAtualizado);
        };
    }, [usuarioLogado]);



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
                            <li><a href="/limpeza">Limpeza</a></li>
                        </ul>
                    </div>
                )}
                <input type="text" className="search-bar" placeholder="Pesquisar Produtos..." />
            </div>

            <nav className="navbar">
                <button className="btn cart-btn" onClick={toggleCartMenu}>
                    <FaShoppingCart size={20} />
                    <span className="cart-count">{carrinho.length}</span>
                </button>

                {showCartMenu && (
                    <div className="cart-menu">
                        <button className="close-cart" onClick={toggleCartMenu}>×</button>
                        <h3>Meu Carrinho</h3>

                        {carrinho.length === 0 ? (
                            <p className="carrinho-vazio">Seu carrinho está vazio</p>
                        ) : (
                            <>
                                <ul className="cart-items">
                                    {carrinho.map((item) => (
                                        <li key={item.id} className="cart-item">
                                            <div className="item-info">
                                                <span className="item-nome">{item.nome}</span>
                                                <span className="item-preco">R$ {parseFloat(item.preco).toFixed(2)}</span>
                                            </div>
                                            <div className="item-actions">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => atualizarQuantidade(item, item.quantidade - 1)}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="item-qty">{item.quantidade}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => atualizarQuantidade(item, item.quantidade + 1)}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removerItem(item)}
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span>R$ {carrinhoTotal.toFixed(2)}</span>
                                </div>

                                <div className="cart-actions">
                                    <button className="limpar-btn" onClick={limparCarrinho}>
                                        Limpar Carrinho
                                    </button>
                                    <button className="finalizar-btn" onClick={finalizarCompra} href="/carrinho">
                                        Finalizar Compra
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {usuarioLogado ? (
                    <div className="usuario-logado">
                        <button className="btn-usuario">Olá,{usuarioLogado.nome}</button>
                      
                        
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
