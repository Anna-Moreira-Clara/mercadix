import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hortifruti = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Hortifruti pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Hortifruti (ajuste o nome conforme seu banco)
        const hortifrutiCategoria = categorias.find(cat => cat.nome.toLowerCase() === 'hortifruti');
        
        if (hortifrutiCategoria) {
          // Redirecionar para a categoria correta
          navigate(`/categoria/${hortifrutiCategoria.id}`);
        } else {
          console.error('Categoria Hortifruti não encontrada');
          // Redirecionar para a página principal se não encontrar
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
        navigate('/');
      });
  }, [navigate]);

  // Renderizar um componente de carregamento enquanto redireciona
  return <div className="carregando">Carregando produtos de Hortifruti...</div>;
};

export default Hortifruti;