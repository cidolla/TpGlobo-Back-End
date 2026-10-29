const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { login } = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');
const router = express.Router();

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    mensagem: 'Muitas tentativas. Tente novamente mais tarde.'
  }
});

router.post('/login', limitarLogin, login);

router.get('/me', autenticar, (req, res) => {
  return res.status(200).json({
    usuario: {
      id: req.usuario._id,
      nome: req.usuario.nome,
      email: req.usuario.email,
      perfil: req.usuario.perfil
    }
  });
});

module.exports = router;