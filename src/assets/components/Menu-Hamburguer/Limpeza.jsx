import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Limpeza = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Limpeza pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Limpeza (ajuste o nome conforme seu banco)
        const limpezaCategoria = categorias.find(cat => cat.nome.toLowerCase() === 'limpeza');
        
        if (limpezaCategoria) {
          // Redirecionar para a categoria correta
          navigate(`/categoria/${limpezaCategoria.id}`);
        } else {
          console.error('Categoria Limpeza não encontrada');
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
  return <div className="carregando">Carregando produtos de Limpeza...</div>;
};

export default Limpeza;
