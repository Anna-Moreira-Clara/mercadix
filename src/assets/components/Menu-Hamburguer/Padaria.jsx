import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Padaria = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria Padaria pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        // Encontrar a categoria Padaria (ajuste o nome conforme seu banco)
        const padariaCategoria = categorias.find(cat => cat.nome.toLowerCase() === 'padaria');

        if (padariaCategoria) {
          // Redirecionar para a categoria correta
          navigate(`/categoria/${padariaCategoria.id}`);
        } else {
          console.error('Categoria Padaria não encontrada');
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
  return <div className="carregando">Carregando produtos de Padaria...</div>;
};

export default Padaria;
