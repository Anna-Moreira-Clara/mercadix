import { useState } from 'react';
import axios from 'axios';
import "./cadastro.css";

// Configure a base URL para todas as requisições
axios.defaults.baseURL = 'http://localhost:5000'; // Ajuste para a URL do seu backend

function ClienteRegistration() {
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
      // Conectando com a rota correta do seu backend
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

  return (
    <div className="cliente-registration">
      <button className="btn-cadastrar" onClick={toggleRegisterModal}>
        Cadastrar-se
      </button>
      
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
    </div>
  );
}

export default ClienteRegistration;