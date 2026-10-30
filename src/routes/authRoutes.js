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

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Operações de autenticação e gerenciamento de acesso
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login do usuário
 *     tags: [Autenticação]
 *     description: Autentica o usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: SenhaSegura123!
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       400:
 *         description: Dados de entrada inválidos.
 *       401:
 *         description: E-mail ou senha inválidos.
 *       429:
 *         description: Limite de tentativas de login excedido.
 *       500:
 *         description: Erro interno do servidor.
 */

router.post('/login', limitarLogin, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Consultar usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       500:
 *         description: Erro interno do servidor.
 */

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