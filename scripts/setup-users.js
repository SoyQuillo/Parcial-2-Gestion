import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const client = new MongoClient("mongodb://localhost:27017");

async function setupUsers() {
    try {
        await client.connect();
        const db = client.db("torneo");
        const usuariosCollection = db.collection("usuario");

        // Obtener todos los usuarios
        const usuarios = await usuariosCollection.find({}).toArray();
        
        console.log(`\nEncontrados ${usuarios.length} usuarios\n`);

        // Actualizar cada usuario con password hasheada y username
        for (const usuario of usuarios) {
            // Si ya tiene password, saltarlo
            if (usuario.password) {
                console.log(`Usuario ${usuario.nombre} ya tiene password, saltando...`);
                continue;
            }

            // Generar username desde el correo (parte antes del @)
            const username = usuario.correo.split('@')[0];
            
            // Crear password por defecto: "password123" hasheada
            const hashedPassword = await bcrypt.hash("password123", 10);

            // Actualizar usuario
            await usuariosCollection.updateOne(
                { _id: usuario._id },
                {
                    $set: {
                        username: username,
                        password: hashedPassword
                    }
                }
            );

            console.log(`Usuario ${usuario.nombre} actualizado:`);
            console.log(`   - Username: ${username}`);
            console.log(`   - Password: password123 (hasheada)`);
        }

        console.log("\nTodos los usuarios han sido configurados!");
        console.log("\nCredenciales de prueba para todos los usuarios:");
        console.log("   Username: (parte antes del @ del correo)");
        console.log("   Password: password123\n");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("Conexión a MongoDB cerrada\n");
    }
}

setupUsers();
