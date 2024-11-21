const db = require('../models');
const Following = db.Following;
const Usuario = db.Usuario;

// Seguir a alguien, pide el id_usuario y id_usuario_seguido
const seguir = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;    
    
    //Condicion para no poder seguirte a vos mismo
    if (id_usuario == id_usuario_seguido) {
        return res.status(400).send({ message: "No puedes seguirte a ti mismo" });
    }
    
    try {
        await Following.create({ id_usuario, id_usuario_seguido });//utiliza el create del Sequelize con el modelo de Following
        return res.status(201).send({ message: "Has comenzado a seguir al usuario" });
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
            return res.status(401).send({message: "Ya sigues a este usuario"});
        }
        else{
            return res.status(500).send({ 
                error: error.message,
                tipo: error.name 
            });
        }
    }
    
};

// Permite dejar de seguir a alguien
const dejarSeguir = async (req, res) => {
    const id_usuario = req.user.id;
    const { id_usuario_seguido } = req.body;

    try {
        //constante con el resultado de la operacion de eliminacion
        const result = await Following.destroy({//destroy devuelve un numero
            where: {
                id_usuario: id_usuario,
                id_usuario_seguido: id_usuario_seguido
            }
        });
        //compara que result tenga un numero, si no entra en el else
        if (result > 0) {
            return res.status(200).send({ message: "Has dejado de seguir al usuario" });
        } else {
            return res.status(404).send({ message: "No se encontró la relación de seguimiento" });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message, tipo: error.name });
    }
};


// Permite obtener la lista de usuarios que sigo
const listaSeguidos = async(req, res) => {
    const id_usuario = req.user.id;
    try {
        //busca en la tabla a los usuarios que sigo
        const usuario = await Usuario.findByPk(id_usuario, {
            include: [{
                model: Usuario,
                as: 'seguidos', // Usa la relación "seguidos"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            }, ],
        });
        //si no encontro usuarios manda un msj
        if (!usuario) {
            return res.status(404).send({ error: 'Empeza a seguir a alguien!!!, por el momento no seguis a nadie....' });
        }
        return res.status(200).send(usuario.seguidos); // Enviar solo los usuarios seguidos
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Permite obtener la lista de las personas que siguen al usuario logiado
const listaSeguidores = async(req, res) => {
    const id_usuario_seguido = req.user.id;

    try {
        //busca en la tabla a los usuarios que me siguen
        const usuario = await Usuario.findByPk(id_usuario_seguido, {
            include: [{
                model: Usuario,
                as: 'seguidores', // Usa la relación "seguidores"
                attributes: ['id', 'nombre', 'nickname'],
                through: { 
                    attributes:  [] 
                }
            }, ],
        });
        //si no encontro a usuarios manda un msj
        if (!usuario) {
            return res.status(404).send({ error: 'No te sigue nadie...... (｡╯︵╰｡) .... ' });
        }
        return res.status(200).send(usuario.seguidores); // Enviar solo los usuarios que son seguidores
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Permite listar a los usuarios con los que existe un seguimiento mutuo
const listaSeguidosMutuos = async(req, res) => {
    //busca al usuario por el token
    const id_usuario = req.user.id;
    try {
        //busco a los usuarios por ID
        const usuario = await db.Usuario.findByPk(id_usuario, {
            //busca la relacion mutua
            include: [
                {
                    model: db.Usuario,
                    as: 'seguidos', // Usuarios que sigues
                    attributes: ['id', 'nombre', 'nickname'],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: db.Usuario,
                    as: 'seguidores', // Usuarios que te siguen
                    attributes: ['id', 'nombre', 'nickname'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        // Filtrar usuarios seguidos, el some(verifica si el usuario seguido tambien esta en la lista de seguidores)
        const mutuals = usuario.seguidos.filter(seg => usuario.seguidores.some(seguidor => seguidor.id === seg.id));
        //filter crea un array

        //si nadie se sigue mutuamente muestra un msj
        if(mutuals.length === 0){
            return res.status(200).send({ message: 'De los que sigues, no te siguen o no seguis a nadie'});
        }
        return res.status(200).send(mutuals); // Enviar solo los usuarios mutuos
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


module.exports = {
    seguir,  
    dejarSeguir,
    listaSeguidos,
    listaSeguidores,
    listaSeguidosMutuos,
};