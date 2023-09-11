/*UBICAMOS LOS REQUERIMIENTOS*/ 
const http = require('http');

/**SALIDA DEL PUERTO */


http.createServer((req,res)=>{

    /* res.write("Hola Juan");
    res.end(); */

    /* salida de tipo Json*/
    res.writeHead(200,{'Content-Type':'application/json'})

    let salida = {
        nombre : "Libardo",
        edad: 24,
        url:req.url
    }

    res.write(JSON.stringify(salida));
    res.end();
})
.listen(4000);

console.log("Habilitado el puerto 4000");