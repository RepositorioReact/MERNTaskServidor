//Rutas para crear proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middelware/auth');
const {check} = require('express-validator');

//Crea un proyecto. api/proyectos
router.post('/',
    auth, //se va al middleware que se ha creado como auth, y verifica lo que haya en él
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//Obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//Actualizar proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar proyecto vía ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)

module.exports = router;