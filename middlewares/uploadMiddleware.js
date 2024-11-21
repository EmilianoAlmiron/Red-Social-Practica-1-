const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento con multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars'); // Carpeta donde se guardarán las imágenes
    },
    filename: function(req, file, cb) {
        //variable con el numero de la fecha y un numero random
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Obtener la extensión del archivo
        const ext = path.extname(file.originalname); 
        //definimos el nombre del archivo
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtrar archivos para asegurarnos de que solo se suban imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    //validacion por el extencion, definido en la linea anterior
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    //validacion con mimitype(contenido)
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);//null(ningun error), true(se verifico correctamente)
    } else {
        cb(new Error('Solo se permiten imágenes en formato JPEG, JPG o PNG'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // Límite de 20MB por imagen
});

module.exports = upload;