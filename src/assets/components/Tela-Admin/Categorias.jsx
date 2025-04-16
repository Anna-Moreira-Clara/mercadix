import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    slug: ''
  });

  useEffect(() => {
    buscarCategorias();
  }, []);

  const buscarCategorias = () => {
    axios.get('http://localhost:5000/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Erro ao buscar categorias:', err));
  };

  const handleEditarClick = (categoria) => {
    setEditandoId(categoria.id);
    setFormData({
      nome: categoria.nome,
      slug: categoria.slug || ''
    });
  };

  const handleSalvarClick = (id) => {
    axios.put(`http://localhost:5000/categorias/${id}`, formData)
      .then(() => {
        setEditandoId(null);
        buscarCategorias();
      })
      .catch(err => console.error('Erro ao atualizar categoria:', err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nome' && !editandoId) {
      // Gera um slug automaticamente a partir do nome
      const slug = value.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      setFormData({ ...formData, [name]: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const abrirModal = () => {
    setFormData({
      nome: '',
      slug: ''
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleAdicionarCategoria = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/categorias', formData)
      .then(() => {
        fecharModal();
        buscarCategorias();
      })
      .catch(err => console.error('Erro ao adicionar categoria:', err));
  };

  const handleExcluirClick = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar os produtos associados.')) {
      axios.delete(`http://localhost:5000/categorias/${id}`)
        .then(() => {
          buscarCategorias();
        })
        .catch(err => console.error('Erro ao excluir categoria:', err));
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
        <button 
          onClick={abrirModal}
          className="botao"
        >
          Adicionar Categoria
        </button>
      </div>

      {/* Modal para adicionar categoria */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Adicionar Nova Categoria</h3>
              <button 
                onClick={fecharModal}
                className="botao"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAdicionarCategoria}>
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Slug (URL):</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">O slug será usado na URL (ex: /categoria/nome-da-categoria)</p>
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
                  Salvar Categoria
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
            <th>Slug</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editandoId === cat.id ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  cat.nome
                )}
              </td>
              <td>
                {editandoId === cat.id ? (
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  cat.slug || '-'
                )}
              </td>
              <td>
                {editandoId === cat.id ? (
                  <button className="text-green-600 hover:underline" onClick={() => handleSalvarClick(cat.id)}>Salvar</button>
                ) : (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => handleEditarClick(cat)}>Editar</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleExcluirClick(cat.id)}>Excluir</button>
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

export default CategoriasAdmin;