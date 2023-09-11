const express = require('express');
const app = express();
//IMPORTAMOS EL CONTROLADOR
const Slide = require('../controllers/slide.controller');
const { verificarToken} = require('../middlewares/auth');

//CREAMOS LAS RUTAS HTTP


app.get('/mostrar-slide', Slide.mostrarSlide);

app.post('/crear-slide', verificarToken, Slide.crearSlide);

app.put('/editar-slide/:id',verificarToken, Slide.editarSlide);

app.delete('/borrar-slide/:id',verificarToken, Slide.borrarSlide);
app.get('/mostrar-img/:imagen',Slide.mostrarImagen)
//EXPORTAMOS LAS RUTAS


module.exports = app;
