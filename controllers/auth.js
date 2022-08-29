const { response } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response ) => {

    const { email, password } = req.body;
    
    try {

        // Validar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB) {
            return res.status(404).json({
                status: false,
                message: 'Correo invalido'
            })
        }

        // Validar password
        const validoPassword = bcrypt.compareSync(password, usuarioDB.password);

        if(!validoPassword) {
            return res.status(400).json({
                status: true,
                message: 'Contraseña invalida'
            })
        }

        // Generar Token
        const token = await generarJWT(usuarioDB.id)

        res.json({
            status: true,
            token
        })
        
    } catch (error) {

        res.json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
}

const googleSigIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB) {

            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@',
                img: picture,
                google: true
            });
            
        } else {
            usuario = usuarioDB,
            usuario.google = true
        }

        // Guarda en DB
        await usuario.save();
        
        // Generar Token
        const token = await generarJWT(usuario.id)

        res.json({
            status: true,
            token
        })
        
    } catch (error) {
        res.status(401).json({
            status: true,
            message: 'Token invalido'
        })
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;

    const token = await generarJWT(uid)

    const usuario = await Usuario.findById(uid);

    res.json({
        status: true,
        token,
        usuario
    })

}

module.exports = {
    login,
    googleSigIn,
    renewToken
}