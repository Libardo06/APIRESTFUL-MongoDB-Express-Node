/** UBICAMOS LOS REQUERIMIENTOS */

const express = require('express');
const mongoose = require('mongoose');

//CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE  EXPRESS JS
const app = express()

const PORT = 4000;
//PETICIONES GET

app.get("/",(req,res)=>{

    //res.send("Hola mundo");
    let salida = {
        nombre : "Libardo",
        edad: 24,
        url:req.url
    }
    res.send(salida);
})

//CONEXION A BASE DE DATOS

mongoose.connect('mongodb://127.0.0.1:27017/apirest', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch(err => {
        console.error("Error de conexión:", err);
    });
//LE ASIGNAMOS UN PUERTO 

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
