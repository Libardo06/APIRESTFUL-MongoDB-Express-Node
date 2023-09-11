const mongoose = require('mongoose')
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

module.exports = mongoose.model("slides",slideSchema);