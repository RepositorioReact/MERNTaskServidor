//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middelware/auth');

//Iniciar sesión
// api/auth. Se pone sólo la diagonal porque ya sabe que es api/auth
router.post('/',
    authController.autenticarUsuario
);

//Obtiene usuario autenticado. Hay que pasar el token que está en el localstorage a este get
router.get('/',
    auth,
    authController.usuarioAutenticado
);
module.exports = router;