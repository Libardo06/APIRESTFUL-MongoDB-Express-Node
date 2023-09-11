/** UBICAMOS LOS REQUERIMIENTOS */
require('./config.js')
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require('cors');
//CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE  EXPRESS JS
const app = express();

//MIDDLEWARE PARA BODYPARSER

app.use(bodyParser.urlencoded({ limit:'10mb',extended: false }));

app.use(bodyParser.json({ limit:'10mb',extended: false }));

//MIDDLEWARE PARA PODER REALIZAR UN CROSSORIGIN Y QUE SE HAGAN PETICIONES DESDE OTRAS APLICACIONES
app.use(cors());
//MIDDLEWARE PARA FILEUPLOAD
app.use(fileUpload());

//IMPORTAMOS LAS RUTAS 
app.use(require('./routes/slide.route.js'));
app.use(require('./routes/galeria.route.js'));
app.use(require('./routes/articulos.route.js'));
app.use(require('./routes/admin.route.js'));
app.use(require('./routes/users.route.js'))
//CONEXION A BASE DE DATOS

mongoose
  .connect("mongodb://127.0.0.1:27017/apirest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((err) => {
    console.error("Error de conexión:", err);
  });


//LE ASIGNAMOS UN PUERTO
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
