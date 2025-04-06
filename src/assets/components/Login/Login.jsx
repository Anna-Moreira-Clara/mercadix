// ./assets/components/Login/Login.jsx
import React from 'react';
import './login.css';

function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Usuário" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
