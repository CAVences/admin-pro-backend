const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');
    
    if(!token) {
        return res.status(401).json({
            status: false,
            message: 'Unauthoraized'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            status: true,
            message: 'Token valido'
        })
    }
}

const validarRole = async(req, res, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        
        if(!usuarioDB) {
            return res.status(404).json({
                status: true,
                message: 'Usuario no existe'
            })
        } else if( usuarioDB.role !== 'ADMIN_ROLE' && uid !== id ) {
            return res.status(403).json({
                status: false,
                message: 'No tiene privilegios para hacer eso'
            })
        }

        next();

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
    
}


module.exports = {
    validarJWT,
    validarRole
}