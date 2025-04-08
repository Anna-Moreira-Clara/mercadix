import React, { useState } from 'react';
import './login.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/usuarios', { // porta do seu backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || 'Erro ao logar');
        return;
      }

      // Login bem-sucedido!
      console.log('Usuário logado:', data);
      localStorage.setItem('usuario', JSON.stringify(data)); // salva no navegador
      window.location.href = '/'; // redireciona para página principal

    } catch (err) {
      console.error('Erro de login:', err);
      setErro('Erro ao conectar ao servidor');
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex.: exemplo@mail.com"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Adicione sua senha"
          />
          {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}
          <a href="#" className="forgot-password">Esqueci minha senha</a>
          <a className="/">
          <button className="login-button" onClick={handleLogin}>Entrar</button>
          </a>
          <p className="register-link">Não tem uma conta? <a href="#">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
