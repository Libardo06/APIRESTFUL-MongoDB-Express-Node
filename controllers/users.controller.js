const User = require('../models/users.model');

const bcrypt = require('bcrypt');



let mostrarUsers = async (req,res)=>{
    try {
        const data = await User.find({}).exec();
        // contar la cantidad de registros
        const registryNumber = await User.countDocuments({})
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

let crearUser = async (req,res)=>{
    let body = req.body;
    let user = new User({
        usuario:body.usuario,
        password: await bcrypt.hash(body.password,10),
        email:body.email
    })

    try {
      let data = await user.save({})
      res.json({
        status:200,
        message:"Registro creado correctamente",
        data
      })

    }catch(err){
        res.status(500)
        res.json({
            message: err.message,
            err
        })

    }
}



let loginUser = async (req, res) => {
  try {
    let body = req.body;
    
    // Buscar al usuario por el nombre de usuario
    let data = await User.findOne({ usuario: body.usuario });
    
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

    res.json({
      status: 200,
      message: `Bienvenido ${data.usuario}`,
      
    });
  } catch (err) {
    // Manejar errores
    res.status(500);
    return res.json({
      message: 'No se pudo realizar la petición'
    });
  }
}


  

let updateUser = (req,res)=>{
  let id = req.params.id;
  let body = req.body;

  User.findById(id)
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
            let datosUser = {
              usuario: body.usuario, // Supongo que deberías usar body.usuario en lugar de body.password para actualizar el nombre de usuario.
              password: pass,
              email:body.email
            };

            User.findByIdAndUpdate(id, datosUser, { new: true, runValidators: true })
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
}

let deleteUser = async (req,res)=>{
  try {
    const id = req.params.id;
    
    const user = await User.findById(id).exec();

    if (!user) {
      res.status(404);
      return res.json({
        status: 404,
        message: 'Registro no encontrado'
      });
    }

    // Borramos en mongoDB
    await User.findByIdAndRemove(id).exec();

    res.json({
      status: 200,
      message: 'Registro borrado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Hubo un error en el servidor'
    });
  }
}


module.exports = {
    mostrarUsers,
    crearUser,
    loginUser,
    updateUser,
    deleteUser
  };