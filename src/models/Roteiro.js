const mongoose = require('mongoose');
const blocoSchema = new mongoose.Schema({
  ordem: {
    type: Number,
    required: true,
    min: 1
  },

  texto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  tipo: {
    type: String,
    enum: ['fala', 'vinheta', 'pausa', 'orientacao'],
    default: 'fala'
  }
});


const roteiroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160
    },

    categoria: {
      type: String,
      required: true,
      enum: [
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
      ]
    },

    status: {
      type: String,
      enum: [
        'rascunho',
        'em_revisao',
        'aprovado',
        'publicado',
        'arquivado'
      ],
      default: 'rascunho'
    },

    blocos: {
      type: [blocoSchema],
      validate: {
        validator: function (blocos) {
          return Array.isArray(blocos) && blocos.length > 0;
        },
        message: 'O roteiro precisa ter pelo menos um bloco de texto.'
      }
    },

    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },

    atualizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  },
  {
    timestamps: true
  }
);

roteiroSchema.index({ status: 1, categoria: 1 });

module.exports = mongoose.model('Roteiro', roteiroSchema);