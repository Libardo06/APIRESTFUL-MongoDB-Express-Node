const express = require('express');
const app = express();
//IMPORTAMOS EL CONTROLADOR
const User = require('../controllers/users.controller');
const { verificarToken} = require('../middlewares/auth');

app.get('/mostrar-usuarios', User.mostrarUsers);
app.post('/crear-usuario', verificarToken, User.crearUser);
app.put('/editar-usuario/:id', verificarToken, User.updateUser);
app.delete('/eliminar-usuario/:id', verificarToken, User.deleteUser);
app.post('/loginUsuario', User.loginUser);


module.exports = app;