const express = require('express');
const app = express();
//IMPORTAMOS EL CONTROLADOR
const Admin = require('../controllers/admin.controller');
const { verificarToken} = require('../middlewares/auth');

app.get('/mostrar-admins', verificarToken, Admin.mostrarAdmins);
app.post('/crear-admin',verificarToken, Admin.crearAdmin);
app.put('/editar-admin/:id',verificarToken, Admin.editarAdmin);
app.delete('/borrar-admin/:id',verificarToken, Admin.eliminarAdmin);
app.post('/login', Admin.login);



module.exports = app;