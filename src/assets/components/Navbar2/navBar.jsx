import React from 'react';
import "./navbarr.css";

const NavBar = ({ onFiltrar }) => {
  const filtrarCategoria = (categoria) => {
    onFiltrar(categoria); // Passa a categoria selecionada para o componente Pai
  };

  return (
    <div className="navBar">
      <nav className="categorias">
        <h3>Produtos mais vendidos:</h3>
        <div>
          <button className='botao' onClick={() => filtrarCategoria('Todos')}>Todos</button>
          <button className='botao' onClick={() => filtrarCategoria('Hortfrut')}>Frutas e Verduras</button>
          <button className='botao' onClick={() => filtrarCategoria('Bebidas')}>Bebidas</button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
