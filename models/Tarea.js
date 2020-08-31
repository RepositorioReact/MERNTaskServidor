const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true //para que mongo elimine los espacios en blanco
    },
    estado: {
        type: Boolean,
        default: false
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,//referencia al id del proyecto al que pertenece (como un join en SQL)
        ref: 'Proyecto' //esta es la referencia para el ObjectId, es decir en qué "tabla o model" tiene que mirar el id
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);