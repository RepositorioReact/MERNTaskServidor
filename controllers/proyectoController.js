const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    try {
        //Crear nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar creador vía JWT
        proyecto.creador = req.usuario.id; //en el middelware de auth.js lo guardamos como req.usuario y accedemos al payload de usuarioController donde se accede al id

        //Guardar proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {

    try {
        //console.log(req.usuario); viene el id del usuario porque ya está autenticado
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1}); //busca en la base de datos todos los proyectos que tengan como creador el id del usuario. creado: -1 invierte el orden
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    //Extraer la información del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto. proyecto.creador viene con un Object por lo que lo convertimos en string
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //Actualizar                               es como el where en sql
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});
        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

//Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto. proyecto.creador viene con un Object por lo que lo convertimos en string
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //Eliminar
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Proyecto eliminado'});
         
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}