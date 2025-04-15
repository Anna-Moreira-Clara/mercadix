// src/utils/carrinhoLocal.js
export const adicionarAoCarrinhoLocal = (produto) => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho_local")) || [];
    const existe = carrinho.find((item) => item.id === produto.id);
  
    if (existe) {
      existe.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
  
    localStorage.setItem("carrinho_local", JSON.stringify(carrinho));
  };
  