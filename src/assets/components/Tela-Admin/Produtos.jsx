import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProdutosAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    produto: '',
    quantidade: '',
    preco: ''
  });

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = () => {
    axios.get('http://localhost:3001/api/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error(err));
  };

  const handleEditarClick = (produto) => {
    setEditandoId(produto.id);
    setFormData({
      produto: produto.produto,
      estoque: produto.estoque,
      preco: produto.preco
    });
  };

  const handleSalvarClick = (id) => {
    axios.put(`http://localhost:5173/dashboard/produtos/${id}`, formData)
      .then(() => {
        setEditandoId(null);
        buscarProdutos();
      })
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2></h2>
      <table border="0" cellPadding="10">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">nome</th>
            <th className="border px-4 py-2">descrição</th>
            <th className="border px-4 py-2">preço (R$)</th>
            <th className="border px-4 py-2">estoque</th>
            <th className="border px-4 py-2">categoria</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="text"
                    name="produto"
                    value={formData.produto}
                    onChange={handleChange}
                  />
                ) : (
                  prod.produto
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="number"
                    name="estoque"
                    value={formData.estoque}
                    onChange={handleChange}
                  />
                ) : (
                  prod.quantidade
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="number"
                    step="0.01"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                  />
                ) : (
                  `R$ ${parseFloat(prod.preco).toFixed(2)}`
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <button onClick={() => handleSalvarClick(prod.id)}>Salvar</button>
                ) : (
                  <button onClick={() => handleEditarClick(prod)}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProdutosAdmin;
