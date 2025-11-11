import { getUsuarioModel , postUsuarioModel, postUsuarioManyModel, updateUsuarioSaldoModel, deleteUsuarioModel } from "../model/usuario.model.js";
import { getUsuarioBySaldoModel, getUsuariosBaloncestoModel } from "../model/apuesta.model.js";
import { validationResult } from "express-validator";

export const getUsuario = async (req, res)=> {
    const { saldo, baloncesto } = req.query;
    if (baloncesto) {
        const result = await getUsuariosBaloncestoModel();
        return res.json({data: result});
    }
    const result = saldo ? await getUsuarioBySaldoModel(parseFloat(saldo)) : await getUsuarioModel();
    res.json({data: result})
}

export const putUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: "Error en la validación",
            errors: errors.array()
        });
    }
    
    const { id, ganancia } = req.body;
    const result = await updateUsuarioSaldoModel(id, parseFloat(ganancia));
    res.json({msg: "Saldo actualizado", result});
}

export const deleteUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: "Error en la validación",
            errors: errors.array()
        });
    }
    
    const { id, eliminarApuestas } = req.body;
    const result = await deleteUsuarioModel(id, eliminarApuestas || false);
    res.json({msg: "Usuario eliminado", result});
}

export const postUsuario = async (req, res) =>{
    const info = req.body;
    const result = (info.length) ? 
    await postUsuarioManyModel(info) :
    await postUsuarioModel(info)
    res.json({msg: "post Usuario", result})
} 


export default {
    getUsuario, 
    postUsuario,
    putUsuario,
    deleteUsuario
}