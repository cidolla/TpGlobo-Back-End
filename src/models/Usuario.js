const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },

    senhaHash: {
      type: String,
      required: true,
      select: false
    },

    perfil: {
      type: String,
      enum: ['admin', 'editor', 'operador'],
      default: 'editor',
      required: true
    },

    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);