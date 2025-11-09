import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {

let token = req.headers["authorization"]

if(!token){
    return res.status(401).json({
        msg: "user no authorized",
        success: false
    })
}

token = token.split(" ");

if(token[0] !== "Bearer"){
    return res.status(401).json({
        msg: "user no authorized",
        success: false})
}

jwt.verify(token[1], 'millavesecreta123*-', (error, deco) => {
    if(error){
        return res.status(401).json({
        msg: "user no authorized",
        success: false
        }
    )
    }

    next()


})
}
