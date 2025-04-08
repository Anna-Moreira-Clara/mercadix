import React, { useState } from "react";
import "./Login.css"; // Se quiser, estilize separado
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        if (data.usuario.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/"); // ou outra rota
        }
      } else {
        setErro(data.error);
      }
    } catch (error) {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
