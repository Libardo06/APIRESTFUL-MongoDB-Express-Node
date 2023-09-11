const jwt = require('jsonwebtoken');

let verificarToken = (req,res,next)=>{
    let token = req.get('Authorization');
    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        if(err){
            res.status(401)
            return res.json({
                message:"No tienes acceso",
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}


module.exports = {
    verificarToken
}