import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Açougue = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Açougue pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Açougue (ajuste o nome conforme seu banco)
        const açougueCategoria = categorias.find(cat => cat.nome.toLowerCase() === 'açougue');
        
        if (açougueCategoria) {
          // Redirecionar para a categoria correta
          navigate(`/categoria/${açougueCategoria.id}`);
        } else {
          console.error('Categoria Açougue não encontrada');
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
  return <div className="carregando">Carregando produtos de Açougue...</div>;
};

export default Açougue;