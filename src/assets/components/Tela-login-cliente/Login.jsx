import React, { useState } from 'react';
import './login.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    
    // Validação básica
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    setErro('');
    
    try {
      const res = await fetch('http://localhost:5000/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || 'Erro ao fazer login');
        return;
      }

      // Login bem-sucedido!
      console.log('Usuário logado:', data);
      localStorage.setItem('usuario', JSON.stringify(data)); // salva no navegador
      
      // Redirecionar baseado no role do usuário (opcional)
      if (data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/'; // página principal para clientes
      }

    } catch (err) {
      console.error('Erro de login:', err);
      setErro('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h3>ESCOLHA UMA OPÇÃO PARA ENTRAR</h3>
          <button className="login-option red-border">Receber código de acesso por email</button>
          <button className="login-option"><FaGoogle className="icon" /> Entrar com <strong>Google</strong></button>
          <button className="login-option"><FaFacebookF className="icon" /> Entrar com <strong>Facebook</strong></button>
        </div>

        <div className="login-right">
          <h3>ENTRAR COM EMAIL E SENHA</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex.: exemplo@mail.com"
              required
            />
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Adicione sua senha"
              required
            />
            {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}
            <a href="#" className="forgot-password">Esqueci minha senha</a>
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <p className="register-link">Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;