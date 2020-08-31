const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true //para que mongo elimine los espacios en blanco
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,//referencia al id del usuario (como un join en SQL)
        ref: 'Usuario' //esta es la referencia para el ObjectId, es decir en qué "tabla o modelo" tiene que mirar el id
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);