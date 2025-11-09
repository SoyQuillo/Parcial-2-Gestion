import { connection } from "../services/mongoDb.service.js"
import { ObjectId } from "mongodb";

export const getUsuarioModel = async () => {
    const conn = await connection();
    const result = await conn.collection("usuario").find({}).toArray();
    return result;
}

export const postUsuarioModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("usuario").insertOne(info);
    return result;
}

export const postUsuarioManyModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("usuario").insertMany(info);
    return result;
}

export const updateUsuarioSaldoModel = async (usuarioId, ganancia) => {
    const conn = await connection();
    const result = await conn.collection("usuario").updateOne(
        { _id: new ObjectId(usuarioId) },
        { $inc: { saldo: ganancia } }
    );
    return result;
}

export const deleteUsuarioModel = async (usuarioId, eliminarApuestas = false) => {
    const conn = await connection();
    if (eliminarApuestas) {
        await conn.collection("apuesta").deleteMany({ usuario: new ObjectId(usuarioId) });
    }
    const result = await conn.collection("usuario").deleteOne({ _id: new ObjectId(usuarioId) });
    return result;
}