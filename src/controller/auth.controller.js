import { generateToken } from "../services/token.service.js";

export const login = (req, res) => {
    try{
        const { username, password} = req.body;
        //Verificacion de usuario

        
        return res.status(200).json({
            token: generateToken({username, password}),
            msg: "Auth success"
        })

    }catch(e){
        res.status(400).json({success: false, data: [], msg: "Auth Error"});
    }
} 