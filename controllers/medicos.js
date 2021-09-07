const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')

    res.json ({
        status: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save();
        
        res.json ({
            status: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: 'Error inesperado...'
        })
    }
}

const actualizarMedico= (req, res = response) => {

    res.json ({
        status: true,
        message: 'huevos'
    })
}

const borrarMedico = (req, res = response) => {

    res.json ({
        status: true,
        message: 'huevos'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}