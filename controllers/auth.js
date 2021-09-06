const { response } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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
        console.log(error);

        res.json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}