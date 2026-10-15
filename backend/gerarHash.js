const bcrypt = require('bcryptjs');

const senha = '36456873';

bcrypt.hash(senha, 10).then(hash => {
    console.log('Cole este hash no .env:');
    console.log(hash);
});