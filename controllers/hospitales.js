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
        console.log(error)
        res.json({
            status: false,
            message: 'Error inesperado'
        })
    }

}

const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const hospital = await Hospital.findById(id);

        if(!hospital) {
            res.status(404).json ({
                status: true,
                message: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true})

        res.json ({
            status: true,
            hospitalActualizado
        })
        
    } catch (error) {

        res.status(500).json ({
            status: false,
            message: 'Hubo un error...'
        })
        
    }


}

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const hospital = await Hospital.findById(id);

        if(!hospital) {
            res.status(404).json ({
                status: true,
                message: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json ({
            status: true,
            message: 'Hospital eliminado'
        })
        
    } catch (error) {

        res.status(500).json ({
            status: false,
            message: 'Hubo un error...'
        })
        
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}