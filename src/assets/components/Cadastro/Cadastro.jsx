import React from "react";

function Cadastro() {
    return (
      <div className="">
        <h2>Cadastro</h2>
        <form>
          
          <input type="text" placeholder="Nome" />
          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Senha" />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }
  
  export default Cadastro;