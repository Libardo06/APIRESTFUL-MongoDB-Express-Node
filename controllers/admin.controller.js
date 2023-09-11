const Admin = require('../models/admin.model');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

let mostrarAdmins = async (req,res)=>{
    try {
        const data = await Admin.find({}).exec();
        // contar la cantidad de registros
        const registryNumber = await Admin.countDocuments({})
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
}

let crearAdmin = async (req,res)=>{
    let body = req.body;
    let admins = new Admin({
        usuario:body.usuario,
        password: await bcrypt.hash(body.password,10)
    })

    try {
      let data = await admins.save({})
      res.json({
        status:200,
        message:"Registro creado correctamente",
        data
      })

    }catch(err){

    }
}

let editarAdmin = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Admin.findById(id)
    .exec()
    .then((data) => {
      if (!data) {
        res.status(404);
        return res.json({
          status: 404,
          message: "El registro no existe",
        });
      }
      
      let pass = data.password;

      const validarCambioPassword = (body, pass) => {
        return new Promise((resolve, reject) => {
          if (body.password == undefined) {
            resolve(pass);
          } else {
            pass = bcrypt.hashSync(body.password, 10);
            resolve(pass);
          }
        });
      };

      const cambioRegistroBD = (id, body, antiguaPassword) => {
        return new Promise((resolve, reject) => {
          try {
            let datosAdmin = {
              usuario: body.usuario, // Supongo que deberías usar body.usuario en lugar de body.password para actualizar el nombre de usuario.
              password: pass,
            };

            Admin.findByIdAndUpdate(id, datosAdmin, { new: true, runValidators: true })
              .exec()
              .then((updatedData) => {
                if (!updatedData) {
                  reject("No se pudo actualizar el registro");
                } else {
                  resolve(updatedData);
                }
              })
              .catch((error) => {
                reject(error);
              });
          } catch (err) {
            reject(err);
          }
        });
      };

      validarCambioPassword(body, pass)
        .then((newPass) => {
          cambioRegistroBD(id, body, newPass)
            .then((respuesta) => {
              return res.status(200).json({
                status: 200,
                data: respuesta,
                message: "El administrador ha sido actualizado",
              });
            })
            .catch((error) => {
              return res.status(500).json({
                status: 500,
                message: "Error al actualizar el administrador",
                error: error,
              });
            });
        })
        .catch((error) => {
          return res.status(500).json({
            status: 500,
            message: "Error al validar la contraseña",
            error: error,
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        message: "Error al buscar el administrador",
        error: error,
      });
    });
};

let eliminarAdmin = async (req,res)=>{
  try {
    const id = req.params.id;
    
    const admin = await Admin.findById(id).exec();

    if (!admin) {
      res.status(404);
      return res.json({
        status: 404,
        message: 'Registro no encontrado'
      });
    }

    // Borramos en mongoDB
    await Admin.findByIdAndRemove(id).exec();

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
}

let login = async (req, res) => {
  try {
    let body = req.body;
    
    // Buscar al usuario por el nombre de usuario
    let data = await Admin.findOne({ usuario: body.usuario });
    
    if (!data) {
      res.status(404);
      return res.json({
        message: "Usuario incorrecto"
      });
    }
    
    // Verificar la contraseña usando bcrypt
    if (!bcrypt.compareSync(body.password, data.password)) {
      res.status(404);
      return res.json({
        message: "Contraseña incorrecta"
      });
    }
    
    // Generar un token JWT
    let token = jwt.sign({
      data
    }, process.env.SECRET, { expiresIn: process.env.TIMETOKEN }); // Cambiado a '30d' para especificar 30 días de duración
    
    res.json({
      status: 200,
      message: `Bienvenido ${data.usuario}`,
      token
    });
  } catch (err) {
    // Manejar errores
    res.status(500);
    return res.json({
      message: 'No se pudo realizar la petición'
    });
  }
}


module.exports = {
    mostrarAdmins,
    crearAdmin,
    editarAdmin,
    eliminarAdmin,
    login
  };