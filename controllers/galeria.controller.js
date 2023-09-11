const Galeria = require('../models/galeria.model');
const fs = require('fs');
const path = require('path')
//PETICIONES GET

let mostrarGaleria = async (req, res) => {
    try {
      const data = await Galeria.find({}).exec();
      const registryNumber = await Galeria.countDocuments({});
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


 let crearGaleria = async (req, res) => {
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
   if (archivo.mimetype != "image/jpeg" && archivo.mimetype != "image/png") {
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
     
     
       let galeria = new Galeria({
         foto: `${nombre}.${extension}`,
       });
       const data = await galeria.save({});
       res.json({
         data,
         status: 201,
         message: "Registro creado correctamente",
       });
       archivo.mv(`./files/galeria/${nombre}.${extension}`);
   } catch (err) {
     res.status(500);
     res.json({
       status: 500,
       message: "No se ha podido guardar el registro",
       err,
     });
   }
 };

  
 let editarGaleria = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  try {
    Galeria.findById(id).exec()
    .then(data => {
      if (!data) {
        res.status(404);
        return res.json({
          status: 404,
          message: "El registro no existe",
        });
      }

      let rutaimagen = data.foto;

      let validarCambioArchivo = (req, rutaimagen) => {
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

            archivo.mv(`./files/galeria/${nombre}.${extension}`, err => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "error en el servidor",
                  err
                });
              }
              //borramos imagen antigua
              if(fs.existsSync(`./files/galeria/${rutaimagen}`)){
                fs.unlinkSync(`./files/galeria/${rutaimagen}`);
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

      let cambiarRegistrosBD = (id, rutaimagen) => {
        return new Promise((resolve, reject) => {
          let datosGaleria = {
            foto: rutaimagen,
          };

          try {
            Galeria.findByIdAndUpdate(id, datosGaleria, {
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

      validarCambioArchivo(req, rutaimagen).then(rutaimagen => {
        cambiarRegistrosBD(id, rutaimagen).then(respuesta => {
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


let borrarGaleria = async (req, res) => {
  try {
    const id = req.params.id;
    
    const galeria = await Galeria.findById(id).exec();

    if (!galeria) {
      res.status(404);
      return res.json({
        status: 404,
        message: 'Registro no encontrado'
      });
    }

    // Borramos registro en carpeta
    if (fs.existsSync(`./files/galeria/${galeria.foto}`)) {
      fs.unlinkSync(`./files/galeria/${galeria.foto}`);
    }

    // Borramos en mongoDB
    await Galeria.findByIdAndRemove(id).exec();

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
  let imagen = req.params.imagen;
  let rutaImagen = `./files/galeria/${imagen}`;

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
   mostrarGaleria,
   crearGaleria,
   editarGaleria,
   borrarGaleria,
   mostrarImagen
 };