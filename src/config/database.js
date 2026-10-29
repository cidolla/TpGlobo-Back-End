const mongoose = require('mongoose');

async function conectarBanco() {
  const uri = process.env.MONGODB_URI;

 
  if (!uri) {
    throw new Error(
      'A variável MONGODB_URI não foi configurada no .env.'
    );
  }


  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(
    `MongoDB conectado. Banco: ${mongoose.connection.name}`
  );
}

module.exports = conectarBanco;