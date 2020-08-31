const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    //Extraer email y password
    const {email, password} = req.body;
    
    try {
        //Revisar que el usuario registrado sea único
        let usuario = await Usuario.findOne({email});//Busca en la base de datos si un usuario tiene ese email

        if(usuario){
            return res.status(400).json({msg:'El usuario ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password. salt se encarga de que si varios usuarios coinciden en la contraseña, se vea en la BD de forma diferente
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //crear y firmar JsonWebToken
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //expira en 1 hora, va en segundos
        }, (error, token) => { //callback
            
            if(error) throw error;

            //Mensaje de confirmación
            res.json({token});//si key y value se llaman igual (token: token), se puede retornar sólo uno de ellos

        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }

}