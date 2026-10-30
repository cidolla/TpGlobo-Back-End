const Roteiro = require('../models/Roteiro');

async function criarRoteiro(req, res) {
  try {
    const { titulo, categoria, blocos } = req.body || {};

    if (
      typeof titulo !== 'string' ||
      titulo.trim().length < 3 ||
      titulo.trim().length > 160
    ) {
      return res.status(400).json({
        mensagem: 'O título deve ter entre 3 e 160 caracteres.'
      });
    }


    const categoriasPermitidas = [
      'politica',
      'economia',
      'esportes',
      'saude',
      'educacao',
      'seguranca',
      'cultura',
      'tecnologia',
      'previsao-do-tempo',
      'outros'
    ];

    if (
      typeof categoria !== 'string' ||
      !categoriasPermitidas.includes(categoria)
    ) {
      return res.status(400).json({
        mensagem: 'Categoria inválida.'
      });
    }


    if (!Array.isArray(blocos) || blocos.length === 0) {
      return res.status(400).json({
        mensagem: 'O roteiro precisa ter pelo menos um bloco.'
      });
    }


    const roteiro = await Roteiro.create({
      titulo: titulo.trim(),
      categoria,
      blocos,
      status: 'rascunho',
      criadoPor: req.usuario._id
    });


    return res.status(201).json({
      mensagem: 'Roteiro criado com sucesso.',
      roteiro
    });
  } catch (erro) {
    if (
      erro.name === 'ValidationError' ||
      erro.name === 'CastError'
    ) {
      return res.status(400).json({
        mensagem: 'Os dados do roteiro são inválidos.',
        detalhes: Object.values(erro.errors || {}).map(
          item => item.message
        )
      });
    }

    console.error('Erro ao criar roteiro:', erro.message);

    return res.status(500).json({
      mensagem: 'Erro interno ao criar o roteiro.'
    });
  }
}

async function listarRoteiros(req, res) {
  try {
    const roteiros = await Roteiro.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      mensagem: 'Roteiros encontrados com sucesso.',
      total: roteiros.length,
      roteiros
    });

  } catch (erro) {
    console.error('Erro ao listar roteiros:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao buscar roteiros.'
    });
  }
}

const mongoose = require('mongoose');

async function buscarRoteiroPorId(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'ID do roteiro inválido.'
      });
    }

    const roteiro = await Roteiro.findById(id);

    if (!roteiro) {
      return res.status(404).json({
        mensagem: 'Roteiro não encontrado.'
      });
    }

    return res.status(200).json({
      mensagem: 'Roteiro encontrado com sucesso.',
      roteiro
    });

  } catch (erro) {
    console.error('Erro ao buscar roteiro:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao buscar roteiro.'
    });
  }
}

module.exports = {
  criarRoteiro,
  listarRoteiros,
  buscarRoteiroPorId
};