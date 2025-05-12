// scripts/hashAdmin.js
const bcrypt = require('bcrypt');

const senha = 'admin';

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
  } else {
    console.log('Hash da senha admin:', hash);
  }
});
