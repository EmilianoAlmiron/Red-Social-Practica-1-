const db = require('../models');
const Following = db.Following;
const Usuario = db.Usuario;

const follow = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;    

    if (id_usuario == id_usuario_seguido) {
        return res.status(400).send({ message: "No puedes seguirte a ti mismo" });
    }

    try {
        await Following.create({ id_usuario, id_usuario_seguido });
        res.status(201).send({ message: "Has comenzado a seguir al usuario" });
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
            res.status(401).send({message: "Ya sigues a este usuario"});
        }
        else{
            res.status(500).send({ 
                error: error.message,
                tipo: error.name 
            });
        }
    }
        
};

const unfollow = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;

    try {
        const result = await Following.destroy({
            where: {
                id_usuario: id_usuario,
                id_usuario_seguido: id_usuario_seguido
            }
        });

        if (result > 0) {
            res.status(200).send({ message: "Has dejado de seguir al usuario" });
        } else {
            res.status(404).send({ message: "No se encontró la relación de seguimiento" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};





const listFollowing = async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const following = await Following.findAll({
            where: { id_usuario: id_usuario },
            include: [{ model: Usuario, as: 'usuario_seguido', attributes: ['nickname', 'nombre'] }]
        });

        res.status(200).send(following);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};






const listFollowers = async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const followers = await Following.findAll({
            where: { id_usuario_seguido: id_usuario },
            include: [{ model: db.Usuarios, as: 'usuario_seguidor', attributes: ['nickname', 'nombre'] }]
        });

        res.status(200).send(followers);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};

const listMutualFollowing = async (req, res) => {
    const id_usuario = req.user.id;

    try {
        const mutuals = await db.sequelize.query(`
            SELECT u.id, u.nombre
            FROM Usuarios u
            INNER JOIN Followings f1 ON u.id = f1.id_usuario_seguido
            INNER JOIN Followings f2 ON u.id = f2.id_usuario
            WHERE f1.id_usuario = :id_usuario AND f2.id_usuario_seguido = :id_usuario
        `, {
            replacements: { id_usuario: id_usuario },
            type: db.Sequelize.QueryTypes.SELECT
        });

        res.status(200).send(mutuals);
    } catch (error) {
        res.status(500).send({ error: error.message, tipo: error.name });
    }
};


module.exports = {
    follow,  
    unfollow,
    listFollowing,
    listFollowers, 
    listMutualFollowing
};