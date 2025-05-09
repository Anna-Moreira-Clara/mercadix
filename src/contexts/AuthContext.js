import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Criando o contexto de autenticação
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se existe um usuário no localStorage ao carregar
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuarios');
    if (usuarioStorage) {
      try {
        setUsuario(JSON.parse(usuarioStorage));
      } catch (e) {
        console.error('Erro ao carregar usuário do localStorage:', e);
        localStorage.removeItem('usuarios');
      }
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email, senha) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/usuarios/login', { email, senha });
      
      if (response.data) {
        const usuarioLogado = response.data;
        setUsuario(usuarioLogado);
        localStorage.setItem('usuarios', JSON.stringify(usuarioLogado));
        
        // Transfere o carrinho local para o backend
        const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
        if (carrinhoLocal.length > 0) {
          for (const item of carrinhoLocal) {
            try {
              await axios.post('/carrinho', {
                usuario_id: usuarioLogado.id,
                produto_id: item.produto_id || item.id,
                quantidade: item.quantidade,
                preco: item.preco
              });
            } catch (err) {
              console.error('Erro ao transferir item do carrinho:', err);
            }
          }
          localStorage.removeItem('carrinho_local');
          window.dispatchEvent(new Event('carrinhoAtualizado'));
        }
        
        return usuarioLogado;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('usuarios');
    setUsuario(null);
    
    // Limpar carrinho local
    if (localStorage.getItem('carrinho_local')) {
      localStorage.removeItem('carrinho_local');
    }
    
    // Disparar evento para outros componentes
    window.dispatchEvent(new Event('userLogout'));
  };

  // Função para verificar se é admin
  const isAdmin = () => {
    return usuario?.role === 'admin';
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    usuario,
    loading,
    error,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;