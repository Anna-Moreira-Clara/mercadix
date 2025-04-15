import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProdutosAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    imagem: '',
    categoria_id: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = () => {
    console.log("Buscando produtos...");
    axios.get('http://localhost:5000/produtos')
      .then(res => {
        console.log("Produtos recebidos:", res.data);
        setProdutos(res.data);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        console.error("Resposta de erro:", err.response);
      });
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
    console.log("Salvando edição do produto com ID:", id);
    console.log("Dados a serem enviados:", formData);
    
    axios.put(`http://localhost:5000/produtos/${id}`, formData)
      .then((res) => {
        console.log("Resposta ao editar:", res.data);
        setEditandoId(null);
        buscarProdutos();
        setStatusMessage('Produto atualizado com sucesso!');
        setTimeout(() => setStatusMessage(''), 3000);
      })
      .catch(err => {
        console.error("Erro ao editar produto:", err);
        console.error("Resposta de erro:", err.response);
        setStatusMessage('Erro ao atualizar produto.');
        setTimeout(() => setStatusMessage(''), 3000);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(`Campo ${name} atualizado para:`, value);
  };

  const abrirModal = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      estoque: '',
      imagem: '',
      categoria_id: ''
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleAdicionarProduto = (e) => {
    e.preventDefault();
    console.log("Tentando adicionar novo produto...");
    console.log("Dados do formulário:", formData);
    
    // Aqui vamos garantir que os tipos de dados estejam corretos
    const dadosFormatados = {
      ...formData,
      preco: Number(formData.preco),
      estoque: Number(formData.estoque),
      categoria_id: Number(formData.categoria_id)
    };
    
    console.log("Dados formatados para envio:", dadosFormatados);
    
    axios.post('http://localhost:5000/produtos', dadosFormatados)
      .then((res) => {
        console.log("Resposta ao adicionar:", res.data);
        fecharModal();
        buscarProdutos();
        setStatusMessage('Produto adicionado com sucesso!');
        setTimeout(() => setStatusMessage(''), 3000);
      })
      .catch(err => {
        console.error("Erro ao adicionar produto:", err);
        if (err.response) {
          console.error("Resposta do servidor:", err.response.data);
          console.error("Status:", err.response.status);
        } else if (err.request) {
          console.error("Requisição enviada mas sem resposta");
        } else {
          console.error("Erro ao configurar requisição:", err.message);
        }
        setStatusMessage('Erro ao adicionar produto. Verifique o console.');
        setTimeout(() => setStatusMessage(''), 5000);
      });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gerenciar Produtos</h2>
        <button 
          onClick={abrirModal}
          className="botao"
        >
          Adicionar Produto
        </button>
      </div>

      {statusMessage && (
        <div className={`p-3 mb-4 rounded ${statusMessage.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {statusMessage}
        </div>
      )}

      {/* Modal para adicionar produto */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Adicionar Novo Produto</h3>
              <button 
                onClick={fecharModal}
                className="botao"
              >
                &times;
              </button>
            </div>
            
            {statusMessage && (
              <div className={`p-3 mb-4 rounded ${statusMessage.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {statusMessage}
              </div>
            )}
            
            <form onSubmit={handleAdicionarProduto}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Preço (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estoque:</label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem:</label>
                <input
                  type="text"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Categoria ID:</label>
                <input
                  type="number"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="botao mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="botao"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          {produtos.length > 0 ? (
            produtos.map(prod => (
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
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">Nenhum produto encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProdutosAdmin;