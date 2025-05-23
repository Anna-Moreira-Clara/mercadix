import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Frios = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Frios pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Frios
        const categoria = categorias.find(cat => cat.nome.toLowerCase() === 'frios');

        if (categoria) {
          navigate(`/categoria/${categoria.id}`);
        } else {
          console.error('Categoria Frios não encontrada');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
        navigate('/');
      });
  }, [navigate]);

  return <div className="carregando">Carregando produtos de Frios...</div>;
};

export default Frios;