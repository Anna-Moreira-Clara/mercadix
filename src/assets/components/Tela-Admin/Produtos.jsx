import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProdutosAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    imagem: '',
    categoria_id: ''
  });

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = () => {
    axios.get('http://localhost:5000/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error(err));
  };

  const handleEditarClick = (produto) => {
    setEditandoId(produto.id);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      imagem: produto.imagem,
      categoria_id: produto.categoria_id
    });
  };

  const handleSalvarClick = (id) => {
    axios.put(`http://localhost:5000/produtos/${id}`, formData)
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
      <h2 className="text-xl font-bold mb-4">Gerenciar Produtos</h2>
      <table className="min-w-full bg-white border border-gray-200" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço (R$)</th>
            <th>Estoque</th>
            <th>Imagem</th>
            <th>Categoria ID</th>
            <th>Ações</th>
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
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                ) : (
                  prod.nome
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                  />
                ) : (
                  prod.descricao
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="number"
                    name="preco"
                    step="0.01"
                    value={formData.preco}
                    onChange={handleChange}
                  />
                ) : (
                  `R$ ${parseFloat(prod.preco).toFixed(2)}`
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
                  prod.estoque
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="text"
                    name="imagem"
                    value={formData.imagem}
                    onChange={handleChange}
                  />
                ) : (
                  prod.imagem
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <input
                    type="number"
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                  />
                ) : (
                  prod.categoria_id
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <button className="text-green-600" onClick={() => handleSalvarClick(prod.id)}>Salvar</button>
                ) : (
                  <button className="text-blue-600" onClick={() => handleEditarClick(prod)}>Editar</button>
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
