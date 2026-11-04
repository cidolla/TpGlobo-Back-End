
const mongoose = require('mongoose');
const Roteiro = require('../models/Roteiro');
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
    const roteiros = await Roteiro.find({
      status: { $ne: 'arquivado' }
    }).sort({ createdAt: -1 });

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

async function atualizarRoteiro(req, res) {
  try {
    const { id } = req.params;
    const dados = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensagem: 'ID do roteiro inválido.'
      });
    }

    if (
      typeof dados !== 'object' ||
      Array.isArray(dados) ||
      Object.keys(dados).length === 0
    ) {
      return res.status(400).json({
        mensagem: 'Informe pelo menos um campo para atualizar.'
      });
    }

    const camposPermitidos = [
      'titulo',
      'categoria',
      'blocos'
    ];

    const camposInvalidos = Object.keys(dados).filter(
      campo => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        mensagem: 'Existem campos não permitidos para atualização.',
        camposInvalidos
      });
    }

    if ('titulo' in dados) {
      if (
        typeof dados.titulo !== 'string' ||
        dados.titulo.trim().length < 3 ||
        dados.titulo.trim().length > 160
      ) {
        return res.status(400).json({
          mensagem: 'O título deve ter entre 3 e 160 caracteres.'
        });
      }
    }

    if ('categoria' in dados) {
      if (
        typeof dados.categoria !== 'string' ||
        !categoriasPermitidas.includes(dados.categoria)
      ) {
        return res.status(400).json({
          mensagem: 'Categoria inválida.'
        });
      }
    }

    if ('blocos' in dados) {
      if (
        !Array.isArray(dados.blocos) ||
        dados.blocos.length === 0
      ) {
        return res.status(400).json({
          mensagem: 'O roteiro precisa ter pelo menos um bloco.'
        });
      }
    }

    const roteiro = await Roteiro.findById(id);

    if (!roteiro) {
      return res.status(404).json({
        mensagem: 'Roteiro não encontrado.'
      });
    }

    if ('titulo' in dados) {
      roteiro.titulo = dados.titulo.trim();
    }

    if ('categoria' in dados) {
      roteiro.categoria = dados.categoria;
    }

    if ('blocos' in dados) {
      roteiro.blocos = dados.blocos;
    }

    roteiro.atualizadoPor = req.usuario._id;

    await roteiro.save();

    return res.status(200).json({
      mensagem: 'Roteiro atualizado com sucesso.',
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

    console.error('Erro ao atualizar roteiro:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao atualizar o roteiro.'
    });
  }
}

async function arquivarRoteiro(req, res) {
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

    if (roteiro.status === 'arquivado') {
      return res.status(409).json({
        mensagem: 'Este roteiro já está arquivado.'
      });
    }
    roteiro.status = 'arquivado';

    roteiro.atualizadoPor = req.usuario._id;

    await roteiro.save();

    return res.status(200).json({
      mensagem: 'Roteiro arquivado com sucesso.',
      roteiro
    });

  } catch (erro) {
    console.error('Erro ao arquivar roteiro:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao arquivar o roteiro.'
    });
  }
}

module.exports = {
  criarRoteiro,
  listarRoteiros,
  buscarRoteiroPorId,
  atualizarRoteiro,
  arquivarRoteiro
};
