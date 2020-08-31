const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg:'No hay Token, permiso no válido'})
    }

    //Validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario; //en el payload viene como 'usuario' cuando se crea un nuevo usuario en usuarioController, esto ya tiene un nuevo objeto para acceder al id
        next();//para que se vaya al siguiente middleware
    } catch (error) {
        return res.status(401).json({msg:'Token no válido'})
    }

}