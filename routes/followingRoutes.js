const express = require("express");
const router = express.Router();
const followingController = require("../controllers/followingController");
const auth = require("../middlewares/authmiddleware");

/**
 * @swagger
 * /followings/follow:
 *   post:
 *     tags: [Follows]
 *     summary: Follow a new user
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
 *               id_usuario_seguido:
 *                 type: integer
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
router.post("/follow", auth, followingController.follow);


//preguntar a copilot o a Romano
router.delete("/unfollow", auth, followingController.unfollow);

/**
 * @swagger
 * /followings/following:
 *   get:
 *     tags: [Follows]
 *     summary: List of users I follow
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
 *     responses:
 *       200:
 *         description: A list of the followed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickname:
 *                   type: string
 *                 nombre:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get("/following", auth, followingController.listFollowing);

router.get("/followers", auth, followingController.listFollowers);
router.get("/mutual", auth, followingController.listMutualFollowing);
module.exports = router;