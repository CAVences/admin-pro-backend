const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img')

    res.json ({
        status: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({ usuario: uid, ...req.body});

    try {

        const hospitalDB = await hospital.save();

        res.json({
            status: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        res.json({
            status: false,
            message: 'Error inesperado'
        })
    }

    res.json ({
        status: true,
        message: 'huevos'
    })
}

const actualizarHospital = (req, res = response) => {

    res.json ({
        status: true,
        message: 'huevos'
    })
}

const borrarHospital = (req, res = response) => {

    res.json ({
        status: true,
        message: 'huevos'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}