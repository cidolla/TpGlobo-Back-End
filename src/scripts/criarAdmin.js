require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const conectarBanco = require('../config/database');
const Usuario = require('../models/Usuario');

async function criarAdmin() {
  try {
    const nome = process.env.ADMIN_NOME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const senha = process.env.ADMIN_SENHA;

    if (!nome || !email || !senha) {
      throw new Error(
        'Informe ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA temporariamente no ambiente.'
      );
    }

    if (
      nome.length > 100 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw new Error('Nome ou e-mail inválido.');
    }

    if (senha.length < 12 || Buffer.byteLength(senha, 'utf8') > 72) {
      throw new Error(
        'A senha deve ter pelo menos 12 caracteres e no máximo 72 bytes.'
      );
    }

    const rounds = Number(process.env.BCRYPT_ROUNDS || 12);

    if (!Number.isInteger(rounds) || rounds < 10 || rounds > 15) {
      throw new Error('BCRYPT_ROUNDS deve ser um número entre 10 e 15.');
    }

    await conectarBanco();

    const existente = await Usuario.findOne({ email });

    if (existente) {
      throw new Error('Já existe um usuário com esse e-mail.');
    }

    const senhaHash = await bcrypt.hash(senha, rounds);

    await Usuario.create({
      nome,
      email,
      senhaHash,
      perfil: 'admin',
      ativo: true
    });

    console.log(`Administrador criado com sucesso: ${email}`);
  } catch (erro) {
    console.error('Não foi possível criar o administrador:', erro.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

criarAdmin();