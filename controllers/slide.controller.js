const Slide = require('../models/slide.model');
const fs = require('fs');
const path = require('path')
//PETICIONES GET

let mostrarSlide = async (req, res) => {
    try {
      const data = await Slide.find({}).exec();
      // contar la cantidad de registros
      const registryNumber = await Slide.countDocuments({})
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


 let crearSlide = async (req, res) => {
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
     
     
       let slide = new Slide({
         imagen: `${nombre}.${extension}`,
         titulo: body.titulo,
         descripcion: body.descripcion,
       });
       const data = await slide.save({});
       res.json({
         data,
         status: 201,
         message: "Registro creado correctamente",
       });
       archivo.mv(`./files/slide/${nombre}.${extension}`);
   } catch (err) {
     res.status(500);
     res.json({
       status: 500,
       message: "No se ha podido guardar el registro",
       err,
     });
   }
 };

  
 let editarSlide = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  try {
    Slide.findById(id).exec()
    .then(data => {
      if (!data) {
        res.status(404);
        return res.json({
          status: 404,
          message: "El registro no existe",
        });
      }

      let rutaimagen = data.imagen;

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

            archivo.mv(`./files/slide/${nombre}.${extension}`, err => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "error en el servidor",
                  err
                });
              }
              //borramos imagen antigua
              if(fs.existsSync(`./files/slide/${rutaimagen}`)){
                fs.unlinkSync(`./files/slide/${rutaimagen}`);
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
          
          if(rutaimagen==""){
            rutaimagen=null;
          }
          let titulo = body.titulo;
          if(titulo==""){
            titulo=null;
          }
          let descripcion = body.descripcion;
          if(descripcion==""){
            descripcion=null;
          }
          let datosSlide = {
            imagen: rutaimagen,
            titulo: titulo,
            descripcion: descripcion,
          };

          try {
            Slide.findByIdAndUpdate(id, datosSlide, {
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


let borrarSlide = async (req, res) => {
  try {
    const id = req.params.id;
    
    const slide = await Slide.findById(id).exec();

    if (!slide) {
      res.status(404);
      return res.json({
        status: 404,
        message: 'Registro no encontrado'
      });
    }

    // Borramos registro en carpeta
    if (fs.existsSync(`./files/slide/${slide.imagen}`)) {
      fs.unlinkSync(`./files/slide/${slide.imagen}`);
    }

    // Borramos en mongoDB
    await Slide.findByIdAndRemove(id).exec();

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
  let rutaImagen = `./files/slide/${imagen}`;

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
   mostrarSlide,
   crearSlide,
   editarSlide,
   borrarSlide,
   mostrarImagen
 };