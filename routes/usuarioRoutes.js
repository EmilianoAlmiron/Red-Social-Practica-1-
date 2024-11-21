const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middlewares/authmiddleware");
const upload = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     tags: [Usuarios]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nombre"
 *               mail:
 *                 type: string
 *                 format: email
 *                 example: "algo@hola.com"
 *               nickname:
 *                 type: string
 *                 example: "Apodo"
 *               password:
 *                 type: string
 *                 example: "poneAlgoSeguro"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 nickname:
 *                   type: string
 *       400:
 *         description: Bad request - missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/registrar", usuarioController.registrar);

/**
 * @swagger
 * /usuarios/mio:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar el perfil del usuario actual
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nombre"
 *               nickname:
 *                 type: string
 *                 example: "Apodo"
 *               mail:
 *                 type: string
 *                 format: email
 *                 example: "Algo@hola.com"
 *               password:
 *                 type: string
 *                 example: "****"
 *               avatar:
 *                 type: string
 *                 format: binary

 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/mio", auth, upload.single('avatar'), usuarioController.actualizar);

/**
 * @swagger
 * /usuarios/lista:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista de todos los usuarios por paginas
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página para paginación
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numero de usuarios por pagina
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       mail:
 *                         type: string
 *                         format: email
 *       400:
 *         description: Bad request - page or limit must be positive
 *       500:
 *         description: Internal server error
 */
router.get("/lista", usuarioController.listado);


/**
 * @swagger
 * /usuarios/iniciarSesion:
 *   post:
 *     tags: [Usuarios]
 *     summary: So vo?
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 format: nickname
 *                 example: "Cordobezzz"
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 mail:
 *                   type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request - Incorrect password    
 *       500:
 *         description: Internal server error
 */
router.post("/iniciarSesion", usuarioController.iniciarSesion);

module.exports = router;