const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Permite registrar a un nuevo usuario
const registrar = async(req, res) => {
    //Desectructura del body lo que le pedimos
    const { nombre, mail, nickname, password } = req.body;

    //Condicion para que no pase si falta algun dato
    if (!nombre || !mail || !nickname || !password) {
        return res.status(400).send({ message: "Faltan datos de completar" });
    }
    try {
        //Crea al usuario 
        const usuario = await Usuario.create(req.body);//usa el create del modelo Usuario de Sequelize
        res.status(201).send(usuario);
    } catch (error) {
        //Error si el Mail o nickname ya existen
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).send({ message: "Mail o nickname ya existente" });
        } else {
            res.status(500).send({
                message: error.message,
                nombre: error.name
            });
        }
    }
};

//Permite listar a todos los usuarios registrados
const listado = async(req, res) => {
    try {
        //Creamos un pagina de inicio y un limite
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        //Condicion para que la pagina y el limite sean positivos
        if (page < 1 || limit < 1) {
            return res.status(400).send({
                message: "La pagina y el limite deben ser positivos"
            })
        }
        
        //Ajusta el indice(el inicio de la pagina)
        const offset = (page - 1) * limit;
        
        //Desectructura en columnas y filas(evitando la contraseña)
        const { count, rows } = await Usuario.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit: limit,
            offset: offset
        });
        
        //Respuesta paginada al cliente
        res.status(200).send({
            totalItems: count,
            totalPages: Math.ceil(count / limit),//se asegura de redondear hacia arriba(para incluir algun elemento restante)
            currentPage: page,
            itemsPerPage: limit,
            data: rows
        })
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Permite autenticar al usuario mediante el nickname y password
const iniciarSesion = async(req, res) => {
    const { nickname, password } = req.body;
    
    try {
        //1 - Constatar que existe una cuenta con ese nickname
        const usuario = await Usuario.findOne({ where: { nickname } });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        //2 - Verificar password
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Password incorrecto" });
        }
        //3 - Crear token
        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            mail: usuario.mail,
            nickname: usuario.nickname,
        }, process.env.JWT_SECRET, { expiresIn: 180 });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({
            message: "Error en el servidor",
            tipo: error.name,
            detalles: error.message
        });
    }
}

//Permite al usuario editar su perfil
const actualizar = async(req, res) => {
    try {
        const id = req.user.id;
        const { nombre, nickname, mail, password } = req.body;
        let avatarPath = null;
        if (req.file) {
            avatarPath = `uploads/avatars/${req.file.filename}`
        }

        // Actualizar los campos
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        // Actualiza los datos si es necesario
        if (nombre) {
            usuario.nombre = nombre;
        }
        
        if (nickname) {
        usuario.nickname = nickname;
        }

        if (mail) {
            usuario.mail = mail;
        }

        if (avatarPath) {
            usuario.avatar = avatarPath; // Guardar la ruta del avatar
        }

        // Solo actualizar la contraseña si fue proporcionada
        if (password) {
            usuario.password = password;
        }

        await usuario.save(); // Sequelize activará el hook `beforeUpdate` si es necesario

        res.status(200).send(usuario);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};


module.exports = {
    registrar,
    actualizar,
    listado,
    iniciarSesion
};