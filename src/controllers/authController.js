const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function login(req, res) {
  try {
    const { email, senha } = req.body || {};

    
    if (
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: 'Informe o e-mail e a senha.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (
      emailNormalizado.length > 254 ||
      Buffer.byteLength(senha, 'utf8') > 72
    ) {
      return res.status(400).json({
        mensagem: 'Os dados informados são inválidos.'
      });
    }

    
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET não foi configurado.');

      return res.status(500).json({
        mensagem: 'A autenticação não está configurada no servidor.'
      });
    }

    const usuario = await Usuario.findOne({
      email: emailNormalizado
    }).select('+senhaHash');

    
    const senhaValida =
      usuario && usuario.senhaHash
        ? await bcrypt.compare(senha, usuario.senhaHash)
        : false;

    if (!usuario || !usuario.ativo || !senhaValida) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.'
      });
    }

    const expiracao = process.env.JWT_EXPIRES_IN || '15m';

    const token = jwt.sign(
      { tipo: 'access' },
      jwtSecret,
      {
        algorithm: 'HS256',
        subject: usuario._id.toString(),
        expiresIn: expiracao,
        issuer: 'tpglobo-api',
        audience: 'tpglobo-client'
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      tipo: 'Bearer',
      expiraEm: expiracao,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro.message);

    return res.status(500).json({
      mensagem: 'Erro interno ao realizar login.'
    });
  }
}

module.exports = { login };