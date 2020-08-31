const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        //revisar si existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Comprobar que el usuario sea dueño de ese proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //se crea la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todas las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        //revisar si existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Comprobar que el usuario sea dueño de ese proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //Obtener las tareas          
        const tareas = await Tarea.find({proyecto}).sort({creado:-1});//find en esta ocasión es como si fuera el wher en sql
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizar tarea
exports.actualizarTareas = async (req, res) => {
 
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg:'No existe esa tarea'});
        }

        //revisar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Comprobar que el usuario sea dueño de ese proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};

        /*if(nombre){
            nuevaTarea.nombre = nombre;
        }

        if(estado){
            nuevaTarea.estado = estado;
        }*/
        //quitamos los if porque hemos suprimido un método en tareaState, y los estados son evaluados siempre como false. Se envia el objeto completo
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findByIdAndUpdate({_id:req.params.id}, nuevaTarea, {new:true});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

//Elimina una tarea
exports.eliminarTarea = async (req, res) => {

    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg:'No existe esa tarea'});
        }

        //revisar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Comprobar que el usuario sea dueño de ese proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No Autorizado'});
        }

        //Eliminar la tarea
        await Tarea.findOneAndRemove({_id:req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}