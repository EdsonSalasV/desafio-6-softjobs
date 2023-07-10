const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkCredentialsExists = (req,res,next) =>{
    const {email,password} =req.body
    if(!email ||!password){
        res
            .status(401)
            .send({message: "no se recibieron las credenciales de esta consulta"})
}
next()
}

const tokenVerification = (req,res,next)=>{
    const token = req.header("Authorization".split("Bearer"))[1]
    if(!token)
    throw{
        code:401,
        message: "debe incluir el token en las cabeceras (Authorization)",
    }
    const tokenValido= jwt.verify(token, process.env.SECRET)
    if(!tokenValido) throw{ code:401, message: "El token es valido"}
    next()
}

module.exports= {
    checkCredentialsExists,
    tokenVerification
}