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
            message: 'Hubo un error...'
        })
    }
}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const medico = await Medico.findById(id);

        if(!medico) {
            res.status(404).json ({
                status: true,
                message: 'Medico no encontrado'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});
        
        res.json ({
            status: true,
            medicoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json ({
            status: false,
            message: 'Hubo un error...'
        })
        
    }
}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const medico = await Medico.findById(id);

        if(!medico) {
            res.status(404).json ({
                status: true,
                message: 'Medico no encontrado'
            })
        }

        await Medico.findByIdAndDelete(id);
        
        res.json ({
            status: true,
            message: 'Medico eliminado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json ({
            status: false,
            message: 'Hubo un error...'
        })
        
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}