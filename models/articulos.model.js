const mongoose = require('mongoose')
//ESQUEMA PARA MODELO CONECTOR A MONGODB
let Schema = mongoose.Schema;
let articulosSchema = new Schema({
  portada: {
    type: String,
    required: [true, "La portada es obligatoria"]
  },
  url:{
    type: String,
    required:[true, "La URL es obligatoria"]
  },
  titulo: {
    type: String,
    required: [true, "El titulo es obligatoria"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripcion es obligatoria"],
  },
  contenido:{
    type : String,
    required:[true,"El contenido es obligatorio"]
  }
});

//EXPORTAMOS EL MODELO
module.exports = mongoose.model("articulos",articulosSchema);