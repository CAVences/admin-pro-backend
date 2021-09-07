const path = require('path');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const { actualizarImagen } = require("../helpers/update-images");


const fileUpload = ( req, res = response) => {

    const tipo = req.params.tabla;
    const id = req.params.id;

    const tiposVallidos = ['hospitales','medicos','usuarios'];
    if(!tiposVallidos.includes(tipo)) {
        return res.status(400).json({
            status: false,
            message: 'No es un medico, usuario u hospital'
        })
    }

    // Validar que exista un archivo
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            estatus: false,
            message: 'No hay ningun archivo'
        })
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if(!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            status: false,
            message: 'No es una extension permitida'
        })
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar el archivo
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {

        if(err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: 'Error la guardar la imagen...'
            })
        }

        // Actualizar bd
        actualizarImagen(tipo, id, nombreArchivo)
 
        res.json({
            status: true,
            message: 'Imagen guardada con exito.',
            nombre: nombreArchivo
        })
    })



}

const verImagen = (req, res = response) => {

    const tipo = req.params.tabla;
    const foto = req.params.image;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}`);

    // imagen default
    if(fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-images.png`);
        res.sendFile(pathImg)
    }

    
}

module.exports = {
    fileUpload,
    verImagen
}