const express = require('express');
const app = express();
//IMPORTAMOS EL CONTROLADOR
const Galeria = require('../controllers/galeria.controller');
const { verificarToken} = require('../middlewares/auth');

//CREAMOS LAS RUTAS HTTP


app.get('/mostrar-galeria', Galeria.mostrarGaleria);

app.post('/crear-galeria', verificarToken, Galeria.crearGaleria);

app.put('/editar-galeria/:id', verificarToken, Galeria.editarGaleria);

app.delete('/borrar-galeria/:id' , verificarToken, Galeria.borrarGaleria);

app.get('/mostrar-imgGaleria/:imagen', Galeria.mostrarImagen);

//EXPORTAMOS LAS RUTAS


module.exports = app;
