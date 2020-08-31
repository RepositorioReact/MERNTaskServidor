const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const { config } = require('dotenv/types');

//crear el servidor 
const app = express();

//conectar a la base de datos
conectarDB();

//Habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended:true}));

//puerto de la app
const PORT = process.env.port;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app //0.0.0.0 para que heroku lo ponga por defecto
app.listen(PORT,() => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
})