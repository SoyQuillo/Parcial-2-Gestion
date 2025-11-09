import { connection } from "../services/mongoDb.service.js"

export const getApuestaModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").find({}).toArray();
    return result;
}

export const getEventoByDeporteModel = async (deporte) => {
    const conn = await connection();
    const result = await conn.collection("evento").find({ deporte }).toArray();
    return result;
}

export const getUsuarioBySaldoModel = async (saldo) => {
    const conn = await connection();
    const result = await conn.collection("usuario").find({ saldo: { $gt: saldo } }).toArray();
    return result;
}

export const postApuestaModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").insertOne(info);
    return result;
}

export const postApuestaManyModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").insertMany(info);
    return result;
}

export const getApuestasEnCursoModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        { $match: { estado: "en curso" } },
        { $lookup: { from: "usuario", localField: "usuario", foreignField: "_id", as: "usuarioData" } },
        { $lookup: { from: "evento", localField: "evento", foreignField: "_id", as: "eventoData" } },
        { $unwind: "$usuarioData" },
        { $unwind: "$eventoData" },
        { $project: { 
            nombre_usuario: "$usuarioData.nombre",
            deporte: "$eventoData.deporte",
            posible_ganancia: 1
        }}
    ]).toArray();
    return result;
}

export const getEventosCuotaLocalModel = async () => {
    const conn = await connection();
    const result = await conn.collection("evento").find({ cuota_local: { $gt: 2.0 } }).toArray();
    return result;
}

export const getUsuariosBaloncestoModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        { $lookup: { from: "evento", localField: "evento", foreignField: "_id", as: "eventoData" } },
        { $unwind: "$eventoData" },
        { $match: { "eventoData.deporte": "Baloncesto" } },
        { $lookup: { from: "usuario", localField: "usuario", foreignField: "_id", as: "usuarioData" } },
        { $unwind: "$usuarioData" },
        { $project: { 
            correo: "$usuarioData.correo",
            pais: "$usuarioData.pais"
        }},
        { $group: { _id: { correo: "$correo", pais: "$pais" } } },
        { $project: { _id: 0, correo: "$_id.correo", pais: "$_id.pais" }}
    ]).toArray();
    return result;
}

export const updateApuestaEstadoModel = async (apuestaId, estado) => {
    const conn = await connection();
    const { ObjectId } = await import("mongodb");
    const result = await conn.collection("apuesta").updateOne(
        { _id: new ObjectId(apuestaId) },
        { $set: { estado } }
    );
    return result;
}

export const getTotalApostadoPorUsuarioModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        { $lookup: { from: "usuario", localField: "usuario", foreignField: "_id", as: "usuarioData" } },
        { $unwind: "$usuarioData" },
        { $group: {
            _id: "$usuario",
            nombre_usuario: { $first: "$usuarioData.nombre" },
            total_apostado: { $sum: "$monto_apostado" }
        }},
        { $project: { _id: 0, usuario_id: "$_id", nombre_usuario: 1, total_apostado: 1 }},
        { $sort: { total_apostado: -1 } }
    ]).toArray();
    return result;
}

export const getPromedioCuotasPorDeporteModel = async () => {
    const conn = await connection();
    const result = await conn.collection("evento").aggregate([
        { $group: {
            _id: "$deporte",
            promedio_cuota_local: { $avg: "$cuota_local" },
            promedio_cuota_visitante: { $avg: "$cuota_visitante" },
            promedio_cuota_empate: { $avg: { $ifNull: ["$cuota_empate", null] } }
        }},
        { $project: {
            _id: 0,
            deporte: "$_id",
            promedio_cuota_local: { $round: ["$promedio_cuota_local", 2] },
            promedio_cuota_visitante: { $round: ["$promedio_cuota_visitante", 2] },
            promedio_cuota_empate: { $round: [{ $ifNull: ["$promedio_cuota_empate", 0] }, 2] }
        }}
    ]).toArray();
    return result;
}

export const getUsuariosMayorGananciaModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        { $match: { estado: "ganada" } },
        { $lookup: { from: "usuario", localField: "usuario", foreignField: "_id", as: "usuarioData" } },
        { $unwind: "$usuarioData" },
        { $group: {
            _id: "$usuario",
            nombre_usuario: { $first: "$usuarioData.nombre" },
            ganancia_acumulada: { $sum: "$posible_ganancia" }
        }},
        { $project: { _id: 0, usuario_id: "$_id", nombre_usuario: 1, ganancia_acumulada: 1 }},
        { $sort: { ganancia_acumulada: -1 } }
    ]).toArray();
    return result;
}

export const getApuestasCompletasModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        { $lookup: { from: "usuario", localField: "usuario", foreignField: "_id", as: "usuarioData" } },
        { $lookup: { from: "evento", localField: "evento", foreignField: "_id", as: "eventoData" } },
        { $unwind: "$usuarioData" },
        { $unwind: "$eventoData" },
        { $project: {
            _id: 0,
            nombre_usuario: "$usuarioData.nombre",
            deporte: "$eventoData.deporte",
            monto_apostado: 1,
            posible_ganancia: 1,
            estado: 1
        }}
    ]).toArray();
    return result;
}