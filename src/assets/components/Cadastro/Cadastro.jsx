import { useState } from 'react';
import axios from 'axios';

function UserRegistration() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    endereco: '',
    telefone: '',
    role: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/usuarios', formData);
      setMessage(response.data.message);
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        endereco: '',
        telefone: '',
        role: ''
      });
      setTimeout(() => {
        toggleRegisterModal();
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={toggleRegisterModal}>Cadastrar-se</button>
      
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Cadastrar</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="nome" 
                placeholder="Nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="cpf" 
                placeholder="CPF" 
                value={formData.cpf} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="password" 
                name="senha" 
                placeholder="Senha" 
                value={formData.senha} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="endereco" 
                placeholder="Endereço" 
                value={formData.endereco} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="tel" 
                name="telefone" 
                placeholder="Telefone" 
                value={formData.telefone} 
                onChange={handleChange} 
                required 
              />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="">Cliente (padrão)</option>
                <option value="admin">Administrador</option>
                <option value="funcionario">Funcionário</option>
              </select>
              
              {message && <p className={message.includes('sucesso') ? 'success-message' : 'error-message'}>{message}</p>}
              
              <div className="modal-buttons">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                <button type="button" onClick={toggleRegisterModal}>Fechar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRegistration;