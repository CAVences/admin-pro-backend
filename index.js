const express = require('express');
const { bdConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config();



//Crear el servidor de express
const app = express();

//Configura CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
bdConnection();

//PASS
//uASTBcNzDmVZ4WYH
//MEAN_USER

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/busqueda', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + process.env.PORT)
})