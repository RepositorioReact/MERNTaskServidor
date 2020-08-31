const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    //extraer email y password
    const {email, password} = req.body;;

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg:'El usuario no existe'});
        }

        //Revisar el password en caso de que el usuario sí exista
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'Password incorrecto'});
        }

        //Si todo es correcto, crear y firmar JsonWebToken
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000 //3600 //expira en 1 hora, va en segundos
        }, (error, token) => { //callback
            
            if(error) throw error;

            //Mensaje de confirmación
            res.json({token});//si key y value se llaman igual (token: token), se puede retornar sólo uno de ellos

        });

    } catch (error) {
        console.log(error);
    }

}

//Obtiene que el usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {

    try {                                   //viene de auth.js      
        const usuario = await Usuario.findById(req.usuario.id).select('-password');//en mongo la forma de decir que no quieres que obtenga un campo es con el menos -password
        res.json({usuario});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Hubo un error'});
    }

}