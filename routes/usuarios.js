const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarRole } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT ,getUsuarios);

router.post('/',
[
    // validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
]
, crearUsuario
);

router.put('/:id',
[
    validarJWT,
    validarRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
], 
actualizarUsuario);

router.delete('/:id',   
    validarJWT,
    borrarUsuario
);


module.exports = router;