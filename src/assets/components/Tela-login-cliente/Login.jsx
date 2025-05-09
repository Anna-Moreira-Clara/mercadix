import { useState } from 'react';
import axios from 'axios';
import './login.css';

axios.defaults.baseURL = 'http://localhost:5000'; // Ajuste conforme necessário

function LoginUsuario() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get('/usuarios', formData);
      const usuario = response.data;

      // Armazena o usuário no localStorage
      localStorage.setItem('usuarios', JSON.stringify(usuario));

      setMessage('Login realizado com sucesso!');

      // Redireciona com base no tipo de usuário
      if (usuario.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao logar:', error);
      setMessage(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
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

          {message && (
            <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <p className="register-link">Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
      </div>
    </div>
  );
}

export default LoginUsuario;
