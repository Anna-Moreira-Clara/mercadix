import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProdutosAdmin() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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

  useEffect(() => {
    buscarProdutos();
    buscarCategorias();
  }, []);

  const buscarProdutos = () => {
    axios.get('http://localhost:5000/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  };

  const buscarCategorias = () => {
    axios.get('http://localhost:5000/categorias')
      .then(res => {
        setCategorias(res.data);
        console.log('Categorias carregadas:', res.data);
      })
      .catch(err => console.error('Erro ao buscar categorias:', err));
  };

  const getCategoryNameById = (categoryId) => {
    const categoria = categorias.find(cat => cat.id === Number(categoryId));
    return categoria ? categoria.nome : 'Categoria não encontrada';
  };

  const getCategorySlugById = (categoryId) => {
    const categoria = categorias.find(cat => cat.id === Number(categoryId));
    return categoria ? categoria.slug || categoria.nome.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
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
        // Redirecionar para a página da categoria
        const categoriaSlug = getCategorySlugById(formData.categoria_id);
        navigate(`/categoria/${categoriaSlug}`);
      })
      .catch(err => console.error('Erro ao atualizar produto:', err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModal = () => {
    // Atualiza a lista de categorias quando abrir o modal
    buscarCategorias();
    
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      estoque: '',
      imagem: '',
      categoria_id: categorias.length > 0 ? categorias[0].id : ''
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleAdicionarProduto = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/produtos', formData)
      .then(() => {
        fecharModal();
        buscarProdutos();
        // Redirecionar para a página da categoria
        const categoriaSlug = getCategorySlugById(formData.categoria_id);
        navigate(`/categoria/${categoriaSlug}`);
      })
      .catch(err => console.error('Erro ao adicionar produto:', err));
  };

  const handleExcluirClick = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      axios.delete(`http://localhost:5000/produtos/${id}`)
        .then(() => {
          buscarProdutos();
        })
        .catch(err => console.error('Erro ao excluir produto:', err));
    }
  };

  const handleAdicionarCategoriaClick = () => {
    // Armazena o estado atual para retornar depois
    sessionStorage.setItem('produtoFormTemp', JSON.stringify(formData));
    // Redireciona para página de categorias
    navigate('/admin/categorias');
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
                <div className="flex justify-between items-center">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Categoria:</label>
                 
                </div>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
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
            <th>Categoria</th>
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
                    className="border px-2 py-1 w-full"
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
                    className="border px-2 py-1 w-full"
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
                    className="border px-2 py-1 w-full"
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
                    className="border px-2 py-1 w-full"
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
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  <div className="truncate max-w-xs">{prod.imagem}</div>
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                  >
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  getCategoryNameById(prod.categoria_id)
                )}
              </td>
              <td>
                {editandoId === prod.id ? (
                  <button className="text-green-600 hover:underline" onClick={() => handleSalvarClick(prod.id)}>Salvar</button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => handleEditarClick(prod)}>Editar</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleExcluirClick(prod.id)}>Excluir</button>
                  </div>
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