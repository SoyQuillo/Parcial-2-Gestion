import { getEventoModel, postEventoManyModel, postEventoModel, updateEventoCuotaVisitanteModel, deleteEventoFinalizadoModel } from "../model/evento.model.js";
import { getEventoByDeporteModel, getEventosCuotaLocalModel, getPromedioCuotasPorDeporteModel } from "../model/apuesta.model.js";

export const getEvento = async (req, res)=> {
    const { deporte, cuota_local, promedio_cuotas } = req.query;
    if (promedio_cuotas) {
        const result = await getPromedioCuotasPorDeporteModel();
        return res.json({data: result});
    }
    if (cuota_local) {
        const result = await getEventosCuotaLocalModel();
        return res.json({data: result});
    }
    const result = deporte ? await getEventoByDeporteModel(deporte) : await getEventoModel();
    res.json({data: result})
}

export const putEvento = async (req, res) => {
    const { id, cuota_visitante } = req.body;
    const result = await updateEventoCuotaVisitanteModel(id, parseFloat(cuota_visitante));
    res.json({msg: "Cuota visitante actualizada", result});
}

export const deleteEvento = async (req, res) => {
    const { id } = req.body;
    const result = await deleteEventoFinalizadoModel(id);
    if (result.error) {
        return res.status(400).json({msg: result.error, success: false});
    }
    res.json({msg: "Evento eliminado", result});
}

export const postEvento = async (req, res) =>{
    const info = req.body;
    const result = (info.length) ? 
    await postEventoManyModel(info) :
    await postEventoModel(info)
    res.json({msg: "post evento", result})
} 


export default {
    getEvento, 
    postEvento,
    putEvento,
    deleteEvento
}