const express = require("express");
const router = express.Router();
const followingController = require("../controllers/followingController");
const auth = require("../middlewares/authmiddleware");

/**
 * @swagger
 * /followings/seguir:
 *   post:
 *     tags: [Follows]
 *     summary: Seguir a un nuevo usuario
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: "1"
 *               id_usuario_seguido:
 *                 type: integer
 *                 example: "1"
 *     responses:
 *       201:
 *         description: You have started following the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 id_usuario_seguido:
 *                   type: integer
 *       400:
 *         description: You can't follow yourself
 *       401:
 *         description: You already follow this user
 *       500:
 *         description: Internal server error
 */
router.post("/seguir", auth, followingController.seguir);


/**
 * @swagger
 * /followings/dejarSeguir:
 *   delete:
 *     tags:
 *       - Follows
 *     summary: Eliminar a un seguidor!......So malo...!!!
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_seguido:
 *                  type: string
 *                  example: "Numero"
 *     responses:
 *       200:
 *         description: Has dejado de seguir al usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Has dejado de seguir al usuario
 *       404:
 *         description: No se encontró la relación de seguimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró la relación de seguimiento
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 *                 tipo:
 *                   type: string
 *                   example: SequelizeDatabaseError
 */
router.delete("/dejarSeguir", auth, followingController.dejarSeguir);

/**
 * @swagger
 * /followings/seguidos/:
 *   get:
 *     tags: [Follows]
 *     summary: Lista de Seguidos
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios Seguidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  type: object
 *               properties: 
 *                 id: 
 *                   type: integer 
 *                   example: 1 
 *                 nombre: 
 *                   type: string 
 *                   example: "Nombre de Usuario" 
 *                 nickname: 
 *                   type: string 
 *                   example: "UsuarioNickname"
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */
router.get("/seguidos", auth, followingController.listaSeguidos);


/**
 * @swagger
 * /followings/seguidores/:
 *   get:
 *     tags: [Follows]
 *     summary: Lista de Seguidores
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios Seguidores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  type: object
 *               properties: 
 *                 id: 
 *                   type: integer 
 *                   example: 1 
 *                 nombre: 
 *                   type: string 
 *                   example: "Nombre de Usuario" 
 *                 nickname: 
 *                   type: string 
 *                   example: "UsuarioNickname"
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal server error
 */
router.get("/seguidores", auth, followingController.listaSeguidores);


/**
 * @swagger
 * /followings/seguimientosMutuos:
 *   get:
 *     tags: [Follows]
 *     summary: Listar usuarios que se siguen mutuamente
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios con seguimiento mutuo 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Nombre de Usuario"
 *                   nickname:
 *                     type: string
 *                     example: "UsuarioNickname"
 *       404:
 *         description: No se encontraron usuarios con seguimiento mutuo
 *       500:
 *         description: Error interno del servidor
 */
router.get("/seguimientosMutuos", auth, followingController.listaSeguidosMutuos);

module.exports = router;