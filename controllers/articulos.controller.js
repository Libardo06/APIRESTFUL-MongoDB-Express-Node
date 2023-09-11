const Articulos = require('../models/articulos.model');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path')
//PETICIONES GET

let mostrarArticulos = async (req, res) => {
    try {
      const data = await Articulos.find({}).exec();
      const registryNumber = await Articulos.countDocuments({});
      res.json({
        registryNumber,
        data
      });
    } catch (err) {
      res.json({
        status: 500,
        message: "Error en la petición",
      });
    }
  };


 let crearArticulo = async (req, res) => {
   let body = req.body;
   //validamos que haya archivos
   if (!req.files) {
    res.status(400);
     return res.json({
       status: 400,
       message: "No se ha subido ningún archivo",
     });
   }
   //CAPTURAMOS EL ARCHIVO
   let archivo = req.files.archivo;
   //validamos el tipo de archivo
   if (archivo.mimetype != "image/jpeg" && archivo.mimetype != "image/png" && archivo.mimetype != "image/jpg") {
     res.status(422)
    return res.json({
      status:422,
      message:"El formato del archivo no es valido."
    })
   }

   //validamos el tamaño del archivo
   if (archivo.size / 1024 / 1024 > 6) {
    res.status(422)
     return res.json({
      status:422,
      message:"El peso maximo permitido es de 6MB"
    })
   }

   //cambiamos el nombre al archivo
   let nombre = Math.floor(Math.random() * 10000);
   //capturamos la extension del archivo
   let extension = archivo.name.split(".").pop();

   try {
     
     
       let articulos = new Articulos({
         portada: `${nombre}.${extension}`,
         url:body.url,
         titulo: body.titulo,
         descripcion: body.descripcion,
         contenido:body.contenido
       });
       const data = await articulos.save({});
       res.json({
         data,
         status: 201,
         message: "Registro creado correctamente",
       });
       let crearCarpeta = mkdirp.sync('./files/articulos/'+body.url)
       archivo.mv(`./files/articulos/${body.url}/${nombre}.${extension}`);
   } catch (err) {
     res.status(500);
     res.json({
       status: 500,
       message: "No se ha podido guardar el registro",
       err,
     });
   }
 };

  
 let editarArticulo = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  try {
    Articulos.findById(id).exec()
    .then(data => {
      if (!data) {
        res.status(404);
        return res.json({
          status: 404,
          message: "El registro no existe",
        });
      }

      let rutaimagen = data.portada;

      let validarCambioArchivo = (req, body, rutaimagen) => {
        return new Promise((resolve, reject) => {
          if (req.files) {
            let archivo = req.files.archivo;
            if (
              archivo.mimetype !== "image/jpeg" &&
              archivo.mimetype !== "image/png"
            ) {
              res.status(422);
              return res.json({
                status: 422,
                message: "El formato del archivo no es válido.",
              });
            }

            if (archivo.size / 1024 / 1024 > 6) {
              res.status(422);
              return res.json({
                status: 422,
                message: "El peso máximo permitido es de 6MB",
              });
            }

            let nombre = Math.floor(Math.random() * 10000);
            let extension = archivo.name.split(".").pop();

            archivo.mv(`./files/articulos/${body.url}/${nombre}.${extension}`, err => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "error en el servidor",
                  err
                });
              }
              //borramos imagen antigua
              if(fs.existsSync(`./files/articulos/${body.url}/${rutaimagen}`)){
                fs.unlinkSync(`./files/articulos/${body.url}/${rutaimagen}`);
              }
              //damos valor a la nueva imagen
              rutaimagen = `${nombre}.${extension}`;
              resolve(rutaimagen);
            });
          } else {
            resolve(rutaimagen);
          }
        });
      };

      let cambiarRegistrosBD = (body, id, rutaimagen) => {
        return new Promise((resolve, reject) => {
          let datosArticulo = {
            portada: rutaimagen,
            url: body.url,
            titulo: body.titulo,
            descripcion: body.descripcion,
            contenido: body.contenido
          };

          try {
            Articulos.findByIdAndUpdate(id, datosArticulo, {
              new: true,
              runValidators: true,
            }).exec()
            .then(updated => {
              let respuesta = {
                res: res,
                data: updated,
              };
              resolve(respuesta);
            })
            .catch(err => {
              let respuesta = {
                res: res,
                error: err,
              };
              reject(respuesta);
            });
          } catch (err) {
            let respuesta = {
              res: res,
              error: err,
            };
            reject(respuesta);
          }
        });
      };

      validarCambioArchivo(req, body, rutaimagen).then(rutaimagen => {
        cambiarRegistrosBD(body, id, rutaimagen).then(respuesta => {
          respuesta.res.json({
            status: 200,
            data: respuesta.data,
            message: "Actualización Exitosa",
          });
        })
        .catch(error => {
          respuesta.res.status(400).json({
            status: 400,
            message: `error al actualizar ${error}`,
          });
        });
      });
    })
    .catch(() => {
      res.status(500);
      return res.json({
        status: 500,
        message: "Error en la petición",
      });
    });
  } catch (err) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Error en la petición",
    });
  }
};


let borrarArticulo = async (req, res) => {
  try {
    const id = req.params.id;
    
    const articulos = await Articulos.findById(id).exec();

    if (!Articulos) {
      res.status(404);
      return res.json({
        status: 404,
        message: 'Registro no encontrado'
      });
    }

    // Borramos la carpeta
    let rutaCarpeta = `./files/articulos/${articulos.url}`;

    rimraf.sync(rutaCarpeta);

    // Borramos en mongoDB
    await Articulos.findByIdAndRemove(id).exec();

    res.json({
      status: 200,
      message: 'Registro borrado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Hubo un error en el servidor'
    });
  }
};

let mostrarImagen = (req,res)=>{
  let imagen = req.params.imagen.split('+');
  let rutaImagen = `./files/articulos/${imagen[0]}/${imagen[1]}`;

  fs.exists(rutaImagen,exists =>{
    if(!exists){

      res.status(404);
      return res.json({
        message:'No existe la imagen'
      })
    }
    res.sendFile(path.resolve(rutaImagen));
  })
}

 //EXPORTAMOS LAS FUNCIONES DEL MODULO
 module.exports = {
   mostrarArticulos,
   crearArticulo,
   editarArticulo,
   borrarArticulo,
   mostrarImagen
 };