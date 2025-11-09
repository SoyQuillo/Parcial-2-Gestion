import jwt from "jsonwebtoken"

export const generateToken = (data) => {

return jwt.sign({
    data: data,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
}, 'millavesecreta123*-')


}