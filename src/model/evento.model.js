import { connection } from "../services/mongoDb.service.js"

export const getEventoModel = async () => {
    const conn = await connection();
    const result = await conn.collection("evento").find({}).toArray();
    return result;
}

export const postEventoModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("evento").insertOne(info);
    return result;
}

export const postEventoManyModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("evento").insertMany(info);
    return result;
}

export const updateEventoCuotaVisitanteModel = async (eventoId, cuota_visitante) => {
    const conn = await connection();
    const { ObjectId } = await import("mongodb");
    const result = await conn.collection("evento").updateOne(
        { _id: new ObjectId(eventoId) },
        { $set: { cuota_visitante } }
    );
    return result;
}

export const deleteEventoFinalizadoModel = async (eventoId) => {
    const conn = await connection();
    const { ObjectId } = await import("mongodb");
    const evento = await conn.collection("evento").findOne({ _id: new ObjectId(eventoId) });
    if (!evento) return { error: "Evento no encontrado" };
    
    const ahora = new Date();
    const fechaEvento = new Date(evento.fecha);
    if (fechaEvento >= ahora) {
        return { error: "El evento aún no ha finalizado" };
    }
    
    const result = await conn.collection("evento").deleteOne({ _id: new ObjectId(eventoId) });
    return result;
}