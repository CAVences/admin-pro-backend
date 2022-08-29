const { response } = require('express')
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
                .skip(desde)
                .limit(5),
        Usuario.countDocuments()
    ])


    // const usuarios = await Usuario.find();

    res.json({
        status: true,
        usuarios,
        total
    });
}

const crearUsuario = async(req, res) => {
    
    const { email, password } = req.body;



    try {

        const existeEmail = await Usuario.findOne({email});

        if(existeEmail) {
            return res.status(400).json({
                status: false,
                message: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);
    
        res.json({
            status: true,
            usuario,
            token
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            status: false,
            message: 'Error inesperado...'
        })
    }

   
}

const actualizarUsuario = async (req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioBD = await Usuario.findById(uid);

        if(!usuarioBD) {
            return res.status(404).json({
                status: false,
                message: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        const { password, google, email, ...campos} = req.body;

        if (usuarioBD.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    status: false,
                    message: 'Ya existe un usuario con ese email'
                })
            }
        }
        
        if(!usuarioBD.google) {
            campos.email = email;
        } else if(usuarioBD.email !== email) {
            return res.status(400).json({
                status: false,
                message: 'Usuarios logeados por google no pueden cambiar su correo'
            })
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            status: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioBD = await Usuario.findById(uid);

        if(!usuarioBD) {
            return res.status(404).json({
                status: false,
                message: 'No hay registros asociados'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            status: true,
            message: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hubo un errro...'
        })
    }
}



module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}