// src/assets/components/Tela-Admin/Estoque.jsx
import React, { useEffect, useState } from 'react';
import Tabletop from 'tabletop';

const Estoque = () => {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    Tabletop.init({
      key: '2PACX-1vR0iIH1jW5HUK1FzugVLPLItsVph_E87Ntj53GNKLGe3hBsE8o16zlUMvdiiWiB771frdR6wIQPadOZ',
      simpleSheet: true
    })
    .then(data => {
      console.log('Dados:', data);
      setDados(data);
    })
    .catch(err => console.error('Erro ao carregar planilha:', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Controle de estoque</h1>
      <table className="min-w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
          <th className="border px-4 py-2">ID</th>
         
            <th className="border px-4 py-2">Produto</th>
            <th className="border px-4 py-2">Quantidade</th>
            <th className="border px-4 py-2">Preço</th>
          </tr>
          <tr>
            <td>15</td>
            <td>15</td>
            <td>15</td>
            <td>15</td>


          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.Produto}</td>
              <td className="border px-4 py-2">{item.Nome}</td>
              <td className="border px-4 py-2">{item.Quantidade}</td>
              <td className="border px-4 py-2">R$ {item.Preço}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Estoque;
