const express = require('express');
const { bdConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config();



//Crear el servidor de express
const app = express();

//Configura CORS
app.use(cors());

//Base de datos
bdConnection();

//PASS
//uASTBcNzDmVZ4WYH
//MEAN_USER


//Rutas
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Hola mi perro'
    })
})

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + process.env.PORT)
})