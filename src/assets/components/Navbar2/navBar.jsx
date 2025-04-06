import React, { useState } from 'react';
import "./navbarr.css";


const navBar = () => {
  
    const filtrarCategoria = (categoria) => {
      setCategoriaSelecionada(categoria);
    };
  
    return(
        <div className="navBar">
            <nav class="categorias">
        <h3>Produtos mais vendidos: </h3>

        <div>
                <button className='botao' onClick={() => filtrarCategoria('Todos')}>Todos</button>
                <button className='botao' onClick={() => filtrarCategoria('Frutas e Verduras')}>Frutas e Verduras</button>
                <button className='botao' onClick={() => filtrarCategoria('Bebidas')}>Bebidas</button>
              </div>
    </nav>
    
        </div>
    
          );
        };
        
       
        
    


export default navBar;