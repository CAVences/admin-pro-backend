const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, verImagen } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload())

router.put('/:tabla/:id', validarJWT , fileUpload);
router.get('/:tabla/:image' , verImagen);

module.exports = router;