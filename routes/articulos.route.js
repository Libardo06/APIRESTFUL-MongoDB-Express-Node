const express = require('express');
const app = express();
//IMPORTAMOS EL CONTROLADOR
const Articulos = require('../controllers/articulos.controller');
const { verificarToken} = require('../middlewares/auth');

//CREAMOS LAS RUTAS HTTP


app.get('/mostrar-articulos', Articulos.mostrarArticulos);
app.post('/agregar-articulo', verificarToken, Articulos.crearArticulo);
app.put('/editar-articulo/:id', verificarToken, Articulos.editarArticulo);
app.delete('/borrar-articulo/:id', verificarToken, Articulos.borrarArticulo);
app.get('/mostrar-imgArticulos/:imagen', Articulos.mostrarImagen)


//EXPORTAMOS LAS RUTAS


module.exports = app;
