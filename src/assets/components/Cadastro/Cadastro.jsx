import React from "react";

function Cadastro() {
    return (
      <div className="">
        <h2>Cadastro</h2>
        <form>
          <label>Digite seu Nome:</label>
          <input type="text" placeholder="Nome" />
          <label>Digite seu Email:</label>
          <input type="text" placeholder="Usuario" />
          <label>Digite sua Senha:</label>
          <input type="password" placeholder="Senha" />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
  
export default Cadastro;