const express = require('express');

const {
  criarRoteiro,
  listarRoteiros,
  buscarRoteiroPorId
} = require('../controllers/roteiroController');

const {
  autenticar,
  autorizarPerfis
} = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Roteiros
 *     description: Gerenciamento dos roteiros do teleprompter
 */

/**
 * @swagger
 * /api/roteiros:
 *   post:
 *     summary: Cadastrar um novo roteiro
 *     tags: [Roteiros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - categoria
 *               - blocos
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Jornal da Noite - Abertura
 *               categoria:
 *                 type: string
 *                 enum: [politica, economia, esportes, saude, educacao, seguranca, cultura, tecnologia, previsao-do-tempo, outros]
 *                 example: politica
 *               blocos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ordem:
 *                       type: integer
 *                       example: 1
 *                     texto:
 *                       type: string
 *                       example: Boa noite. Começa agora o Jornal da Noite.
 *                     tipo:
 *                       type: string
 *                       enum: [fala, vinheta, pausa, orientacao]
 *                       example: fala
 *     responses:
 *       201:
 *         description: Roteiro criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Perfil sem permissão para cadastrar roteiros.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post(
  '/',
  autenticar,
  autorizarPerfis('admin', 'editor'),
  criarRoteiro
);

/**
 * @swagger
 * /api/roteiros:
 *   get:
 *     summary: Listar todos os roteiros
 *     tags: [Roteiros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roteiros retornada com sucesso.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Perfil sem permissão.
 *       500:
 *         description: Erro interno do servidor.
 */

router.get(
  '/',
  autenticar,
  autorizarPerfis('admin', 'editor', 'operador'),
  listarRoteiros
);


/**
 * @swagger
 * /api/roteiros/{id}:
 *   get:
 *     summary: Buscar roteiro pelo identificador
 *     tags: [Roteiros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6ae3e2bb620fc9a9addaae81
 *     responses:
 *       200:
 *         description: Roteiro encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token não informado ou inválido.
 *       403:
 *         description: Perfil sem permissão.
 *       404:
 *         description: Roteiro não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

router.get(
  '/:id',
  autenticar,
  autorizarPerfis('admin', 'editor', 'operador'),
  buscarRoteiroPorId
);

module.exports = router;