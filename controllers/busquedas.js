const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getBusqueda = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    const [ usuarios, medicos, hospitales ] = await Promise.all([
         Usuario.find({ nombre: regex}),
         Medico.find({ nombre: regex}),
         Hospital.find({ nombre: regex})
    ])

    res.json({
        status: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getColeccion = async (req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    let data = []

    // const [ usuarios, medicos, hospitales ] = await Promise.all([
    //      Usuario.find({ nombre: regex}),
    //      Medico.find({ nombre: regex}),
    //      Hospital.find({ nombre: regex})
    // ])

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
        break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
        break
        case 'usuarios':
            data = await Hospital.find({ nombre: regex });
        break
        default: 
            return res.status(400).json({
                status: false,
                message: 'La tabla tiene que ser usuarios, medicos o hospitales'

            })
    }

    res.json({
        status: true,
        resultados: data
    })
}

module.exports = {
    getBusqueda,
    getColeccion
}