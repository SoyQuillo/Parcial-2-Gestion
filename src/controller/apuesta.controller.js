import { postApuestaModel, postApuestaManyModel, getApuestaModel, getApuestasEnCursoModel, updateApuestaEstadoModel, getTotalApostadoPorUsuarioModel, getUsuariosMayorGananciaModel, getApuestasCompletasModel } from "../model/apuesta.model.js"
import { ObjectId } from "mongodb";

export const getApuesta = async (req, res)=> {
    const { estado, total_apostado, mayor_ganancia, completa } = req.query;
    if (completa) {
        const result = await getApuestasCompletasModel();
        return res.json({data: result});
    }
    if (total_apostado) {
        const result = await getTotalApostadoPorUsuarioModel();
        return res.json({data: result});
    }
    if (mayor_ganancia) {
        const result = await getUsuariosMayorGananciaModel();
        return res.json({data: result});
    }
    const result = estado === "en curso" ? await getApuestasEnCursoModel() : await getApuestaModel();
    res.json({data: result})
}

export const putApuesta = async (req, res) => {
    const { id, estado } = req.body;
    const result = await updateApuestaEstadoModel(id, estado);
    res.json({msg: "Estado de apuesta actualizado", result});
}

export const postApuesta = async (req, res) =>{
    try {
        const info = req.body;
        
        if (Array.isArray(info)) {
            const apuestas = info.map(apuesta => ({
                ...apuesta,
                usuario: new ObjectId(apuesta.usuario),
                evento: new ObjectId(apuesta.evento)
            }));
            const result = await postApuestaManyModel(apuestas);
            return res.json({msg: "post apuestas (múltiples)", result});
        }
        
        info.usuario = new ObjectId(info.usuario);
        info.evento = new ObjectId(info.evento);
        const result = await postApuestaModel(info);
        res.json({msg: "post apuesta", result});
    } catch (error) {
        res.status(400).json({msg: "Error al procesar apuesta", error: error.message});
    }
} 


export default {
    getApuesta, 
    postApuesta,
    putApuesta
}