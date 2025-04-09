import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, getEmail] = useState("");
  const [senha, getSenha] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/usuarios", { email, senha });
      alert("Bem-vindo " + res.data.usuarios.nome);
    } catch (err) {
      alert("Login inválido");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => getEmail(e.target.value)} />
      <input type="password" value={senha} onChange={(e) => getSenha(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;
