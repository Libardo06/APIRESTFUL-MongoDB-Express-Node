const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let adminSchema = new Schema({

    usuario:{
        type: String,
        required : [true,"El usuario es obligatorio"],
        unique:[ true , "Este usuario ya existe"]
    },
    password:{
        type:String,
        required:[true,'La contraseña no puede estar vacia']
    }
})
/* EVITAR DEVOLVER EN LA DATA EL  CAMPO PASSWORD */

adminSchema.methods.toJSON = function(){

    let admins = this;
    let adminObject = admins.toObject();
    delete adminObject.password;
    return adminObject;
}


module.exports = mongoose.model("admins",adminSchema);