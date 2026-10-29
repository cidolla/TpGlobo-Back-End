require('dotenv').config();

const app = require('./app');
const conectarBanco = require('./config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // Primeiro, conecta ao banco de dados.
    await conectarBanco();

    // Só inicia a API após a conexão.
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (erro) {
    console.error(
      'Erro ao iniciar a API:',
      erro.message
    );

    process.exit(1);
  }
}

iniciarServidor();