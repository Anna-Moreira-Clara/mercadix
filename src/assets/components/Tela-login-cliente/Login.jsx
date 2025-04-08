import React, { useState } from 'react';
import './login.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';


  
  const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
  
    useEffect(() => {
      axios
        .get("http://localhost:5000/usuarios")
        .then((response) => {
          setUsuarios(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar usuarios:", error);
        });
    }, []);

  return (
    
    <div className="login-container">
      <div className="login-box">
      
      {usuarios.map((usuario) => (
        <div className="login-right">
          <h3>ENTRAR COM EMAIL E SENHA</h3>
          <input
            key={usuario.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex.: exemplo@mail.com"
          />
          <input
            key={usuario.senha}
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
       ))}
      </div>
    </div>
  
  );

  }
export default Usuarios;
