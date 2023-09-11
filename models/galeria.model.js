const mongoose = require('mongoose')
//ESQUEMA PARA MODELO CONECTOR A MONGODB
let Schema = mongoose.Schema;
let galeriaSchema = new Schema({
  foto: {
    type: String,
    required: [true, "La imagen es obligatoria"],
  },
});

module.exports = mongoose.model("galerias",galeriaSchema);