const db = require('../db');
const fs = require('fs');
const path = require('path');

// Função para gerar o nome do componente em PascalCase
const gerarNomeComponente = (nome) => {
  return nome
    .toLowerCase()
    .replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase())
    .replace(/\s|-/g, '');
};

// Criar nova categoria
exports.criarCategoria = (req, res) => {
  const { nome, descricao } = req.body;

  const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';

  db.query(sql, [nome, descricao], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const nomeArquivo = nome.replace(/\s+/g, '-').toLowerCase(); // Ex: padaria => padaria
    const nomeComponente = gerarNomeComponente(nome); // Ex: Padaria

    const filePath = path.join(
      'C:\\Users\\anna_\\mercadix\\src\\assets\\components\\Menu-Hamburguer',
      `${nomeArquivo}.jsx`
    );

    const jsxContent = `
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ${nomeComponente} = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar a categoria ${nome} pelo nome
    axios.get('http://localhost:5000/categorias')
      .then(response => {
        const categorias = response.data;
        const categoria = categorias.find(cat => cat.nome.toLowerCase() === '${nome.toLowerCase()}');

        if (categoria) {
          navigate(\`/categoria/\${categoria.id}\`);
        } else {
          console.error('Categoria ${nome} não encontrada');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
        navigate('/');
      });
  }, [navigate]);

  return <div className="carregando">Carregando produtos de ${nome}...</div>;
};

export default ${nomeComponente};
`.trim();

    // Criar o arquivo JSX
    fs.writeFile(filePath, jsxContent, (err) => {
      if (err) {
        console.error('Erro ao criar arquivo JSX:', err);
        return res.status(500).json({ error: 'Erro ao criar o componente JSX' });
      }

      // Caminho para o App.jsx
      const appJsxPath = path.join('C:\\Users\\anna_\\mercadix\\src\\App.jsx');

      fs.readFile(appJsxPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler App.jsx:', err);
          return res.status(500).json({ error: 'Erro ao ler App.jsx' });
        }

        const importLine = `import ${nomeComponente} from './assets/components/Menu-Hamburguer/${nomeArquivo}.jsx';\n`;
        const routeLine = `\n          <Route path='/${nomeArquivo}' element={<${nomeComponente} />} />`;

        let novoConteudo = data;

        // Adicionar import se não existir
        if (!data.includes(importLine)) {
          const ultimaImport = data.lastIndexOf("import");
          const proximaLinha = data.indexOf("\n", ultimaImport);
          novoConteudo = data.slice(0, proximaLinha + 1) + importLine + data.slice(proximaLinha + 1);
        }

        // Adicionar rota na seção do LayoutComNavbar
        const padraoRotas = /<Route element={<LayoutComNavbar\s*\/?>}>([\s\S]*?)<\/Route>/;
        const match = novoConteudo.match(padraoRotas);

        if (match) {
          const rotasExistentes = match[1];
          if (!rotasExistentes.includes(routeLine.trim())) {
            const novaSecao = `<Route element={<LayoutComNavbar />}>${rotasExistentes}${routeLine}\n          </Route>`;
            novoConteudo = novoConteudo.replace(padraoRotas, novaSecao);
          }
        }

        fs.writeFile(appJsxPath, novoConteudo, (err) => {
          if (err) {
            console.error('Erro ao atualizar App.jsx com nova rota:', err);
            return res.status(500).json({ error: 'Erro ao atualizar App.jsx' });
          }

          res.status(201).json({
            message: 'Categoria criada com sucesso!',
            id: result.insertId,
            jsxFile: filePath,
            rotaAdicionada: `/${nomeArquivo}`,
          });
        });
      });
    });
  });
};

// Listar categorias
exports.listarCategorias = (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

// Atualizar categoria por ID
exports.atualizarCategoria = (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';

  db.query(sql, [nome, descricao, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Categoria atualizada com sucesso!' });
  });
};

// Deletar categoria por ID
exports.deletarCategoria = (req, res) => {
  db.query('DELETE FROM categorias WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Categoria deletada com sucesso!' });
  });
};
