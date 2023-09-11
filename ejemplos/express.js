/** UBICAMOS LOS REQUERIMIENTOS */

    const express = require('express');

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
    //LE ASIGNAMOS UN PUERTO 

    app.listen(PORT,()=>{
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    })
