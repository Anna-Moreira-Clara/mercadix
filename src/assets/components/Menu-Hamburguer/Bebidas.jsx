import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bebidas = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Bebidas pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Bebidas (ajuste o nome conforme seu banco)
        const bebidasCategoria = categorias.find(cat => cat.nome.toLowerCase() === 'bebidas');
        
        if (bebidasCategoria) {
          // Redirecionar para a categoria correta
          navigate(`/categoria/${bebidasCategoria.id}`);
        } else {
          console.error('Categoria Bebidas não encontrada');
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
  return <div className="carregando">Carregando produtos de Bebidas...</div>;
};

export default Bebidas;
