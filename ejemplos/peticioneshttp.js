/** UBICAMOS LOS REQUERIMIENTOS */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE  EXPRESS JS
const app = express();

//MIDDLEWARE PARA BODYPARSER

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
//ESQUEMA PARA MODELO CONECTOR A MONGODB
let Schema = mongoose.Schema;
let slideSchema = new Schema({
  imagen: {
    type: String,
    required: [true, "La imagen es obligatoria"],
  },
  titulo: {
    type: String,
    required: false,
  },
  descripcion: {
    type: String,
    required: false,
  },
});

const Slide = mongoose.model("slides",slideSchema);


//PETICIONES GET

app.get("/", async (req, res) => {
  try {
    const data = await Slide.find({}).exec();
    
    res.json({
      status: 200,
      data
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error en la petición",
    });
  }
});

//PETICIONES POST
app.post("/crear-slide", (req, res) => {
  let slide = req.body;
  res.json({
    slide,
  });
});
//PETICIONES PUT
app.put("/editar-slide/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});
//PETICIONES DELETE
app.delete("/borrar-slide/:id", (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

//CONEXION A BASE DE DATOS
const PORT = 4000;
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
