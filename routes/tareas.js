//Rutas para crear tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middelware/auth');
const {check} = require('express-validator');

//Crear una tarea
//api/tarea
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtener tareas por proyectos
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTareas
);

//eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;