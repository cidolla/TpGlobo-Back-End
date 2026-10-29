const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  const correspondencia =
    typeof cabecalho === 'string'
      ? cabecalho.match(/^Bearer\s+(\S+)$/i)
      : null;

  if (!correspondencia) {
    return res.status(401).json({
      mensagem: 'Token de autenticação não informado.'
    });
  }

  const token = correspondencia[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET não foi configurado.');

    return res.status(500).json({
      mensagem: 'A autenticação não está configurada no servidor.'
    });
  }

  let dadosToken;

  try {
    dadosToken = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'tpglobo-api',
      audience: 'tpglobo-client'
    });
  } catch (erro) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.'
    });
  }

  if (
    !dadosToken ||
    typeof dadosToken !== 'object' ||
    typeof dadosToken.sub !== 'string' ||
    dadosToken.tipo !== 'access'
  ) {
    return res.status(401).json({
      mensagem: 'Token inválido.'
    });
  }

  try {
    const usuario = await Usuario.findById(dadosToken.sub)
      .select('_id nome email perfil ativo');

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        mensagem: 'Usuário inválido ou inativo.'
      });
    }

    req.usuario = usuario;

    return next();
  } catch (erro) {
    console.error('Erro ao verificar usuário:', erro.message);

    return res.status(500).json({
      mensagem: 'Erro interno ao verificar autenticação.'
    });
  }
}

function autorizarPerfis(...perfisPermitidos) {
  return function (req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Autenticação necessária.'
      });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        mensagem: 'Você não tem permissão para esta operação.'
      });
    }

    return next();
  };
}

module.exports = {
  autenticar,
  autorizarPerfis
};