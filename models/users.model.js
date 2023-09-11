const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema;

let userSchema = new Schema({

    usuario:{
        type: String,
        required : [true,"El usuario es obligatorio"],
        unique:[ true , "Este usuario ya existe"]
    },
    password:{
        type:String,
        required:[true,'La contraseña no puede estar vacia']
    },
    email:{
        type:String,
        required:[true,"El email es obligatorio"],
        unique:[true ,"Ya hay un usuario con este correo electronico"]
    }
})
/* EVITAR DEVOLVER EN LA DATA EL  CAMPO PASSWORD */

userSchema.methods.toJSON = function(){

    let users = this;
    let usersObject = users.toObject();
    delete usersObject.password;
    return usersObject;
}

//DEVOLVER MENSAJE PERSONALIZADO PARA VALIDACIONES UNICAS
userSchema.plugin(uniqueValidator,{message:'El {PATH}: {VALUE} Ya esta en uso'});

module.exports = mongoose.model("users",userSchema);