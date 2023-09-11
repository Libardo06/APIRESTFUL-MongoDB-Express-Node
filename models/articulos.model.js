const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//ESQUEMA PARA MODELO CONECTOR A MONGODB
let Schema = mongoose.Schema;
let articulosSchema = new Schema({
  portada: {
    type: String,
    required: [true, "La portada es obligatoria"]
  },
  url:{
    type: String,
    required:[true, "La URL es obligatoria"],
    unique:[true, "Ya existe un articulo con esta URL"]
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
//DEVOLVER MENSAJE PERSONALIZADO PARA VALIDACIONES UNICAS
articulosSchema.plugin(uniqueValidator,{message:'El {PATH}: {VALUE} Ya esta en uso'});
//EXPORTAMOS EL MODELO
module.exports = mongoose.model("articulos",articulosSchema);