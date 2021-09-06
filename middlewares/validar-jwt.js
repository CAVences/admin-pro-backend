const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');
    
    if(!token) {
        return res.status(401).json({
            status: false,
            message: 'Unauthoraized'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)
        res.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            status: true,
            message: 'Token valido'
        })
    }
}

module.exports = {
    validarJWT
}