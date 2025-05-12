import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for saved user on mount
  useEffect(() => {
    const checkLoggedInUser = () => {
      const usuarioStorage = localStorage.getItem('usuarios');
      const remember = localStorage.getItem('rememberMe') === 'true';
      
      setRememberMe(remember);
      
      if (usuarioStorage) {
        try {
          let parsedUser = JSON.parse(usuarioStorage);
          // Handle if users is stored as array
          if (Array.isArray(parsedUser)) {
            parsedUser = parsedUser[0];
          }
          setUsuario(parsedUser);
          
          // Se estiver usando token, poderia verificar validade aqui
          // await verifyToken(parsedUser.token);
        } catch (err) {
          console.error("Error parsing user data:", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  // Login function
  const login = async (email, senha, remember = false) => {
    setError(null);
    try {
      const response = await axios.post('/usuarios/login', { email, senha });
      
      if (!response.data || response.data.error) {
        throw new Error(response.data?.error || 'Erro ao fazer login');
      }
      
      const usuarioData = response.data;
      
      // Store user in localStorage
      localStorage.setItem('usuarios', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
      setRememberMe(remember);
      localStorage.setItem('rememberMe', remember.toString());
      
      // Transfer local cart to backend
      await transferirCarrinhoLocal(usuarioData.id);
      
      return usuarioData;
    } catch (error) {
      setError(error.response?.data?.message || 'Email ou senha incorretos');
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao cadastrar usuário');
      throw error;
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    setError(null);
    try {
      if (!usuario) throw new Error('Nenhum usuário logado');
      
      const response = await axios.put(`/usuarios/${usuario.id}`, userData);
      const updatedUser = response.data;
      
      // Update local storage
      localStorage.setItem('usuarios', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar usuário');
      throw error;
    }
  };

  // Password recovery
  const requestPasswordReset = async (email) => {
    setError(null);
    try {
      const response = await axios.post('/usuarios/reset-password', { email });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao solicitar recuperação de senha');
      throw error;
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    setError(null);
    try {
      const response = await axios.post('/usuarios/reset-password/confirm', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao resetar senha');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('usuarios');
    if (!rememberMe) {
      localStorage.removeItem('rememberMe');
    }
    setUsuario(null);
    
    // Clear local cart if exists
    if (localStorage.getItem('carrinho_local')) {
      localStorage.removeItem('carrinho_local');
    }
    
    // Dispatch event to notify components about cart update
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  };

  // Helper to transfer local cart to user cart
  const transferirCarrinhoLocal = async (userId) => {
    const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho_local')) || [];
    if (carrinhoLocal.length > 0) {
      for (const item of carrinhoLocal) {
        try {
          await axios.post('/carrinho', {
            usuario_id: userId,
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
  };

  // Check if user is admin
  const isAdmin = () => {
    return usuario?.role === 'admin';
  };

  // Check if user is logged in
  const isAuthenticated = () => {
    return !!usuario;
  };

  // Value to be provided by context
  const value = {
    usuario,
    login,
    logout,
    register,
    updateUser,
    requestPasswordReset,
    resetPassword,
    isAdmin,
    isAuthenticated,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};