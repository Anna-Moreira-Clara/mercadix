import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Beleza = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Beleza pelo nome
    axios.get('http://localhost:5000/categorias') // ajuste a porta conforme seu backend (5000 ou 3001)
      .then(response => {
        const categorias = response.data;
        const categoria = categorias.find(cat => cat.nome.toLowerCase() === 'beleza');

        if (categoria) {
          // Redireciona para a rota com o ID da categoria
          navigate(`/categoria/${categoria.id}`);
        } else {
          console.error('Categoria "Beleza" não encontrada.');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
        navigate('/');
      });
  }, [navigate]);

  return (
    <div className="carregando">
      Carregando produtos da categoria Beleza...
    </div>
  );
};

export default Beleza;
