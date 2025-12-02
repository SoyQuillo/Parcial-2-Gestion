import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const client = new MongoClient("mongodb://localhost:27017");

async function setupUsers() {
    try {
        console.log("🔍 Iniciando configuración de usuarios...");
        await client.connect();
        console.log("✅ Conexión establecida con MongoDB");
        
        const db = client.db("torneo");
        const usuariosCollection = db.collection("usuario");

        // Obtener todos los usuarios
        console.log("\n🔎 Buscando usuarios en la base de datos...");
        const usuarios = await usuariosCollection.find({}).toArray();
        
        console.log(`\n👥 Usuarios encontrados: ${usuarios.length}`);

        let usuariosActualizados = 0;
        let usuariosExistentes = 0;

        // Actualizar cada usuario con password hasheada y username
        console.log("\n🔄 Procesando usuarios...\n");
        for (const usuario of usuarios) {
            // Si ya tiene password, saltarlo
            if (usuario.password) {
                console.log(`⏭️  Usuario '${usuario.nombre}' ya posee credenciales configuradas`);
                usuariosExistentes++;
                continue;
            }

            // Generar username desde el correo (parte antes del @)
            const username = usuario.correo.split('@')[0];
            
            // Crear password por defecto: "password123" hasheada
            console.log(`🔑 Generando credenciales para: ${usuario.nombre}`);
            const hashedPassword = await bcrypt.hash("password123", 10);

            // Actualizar usuario
            console.log(`💾 Guardando cambios para: ${usuario.nombre}`);
            await usuariosCollection.updateOne(
                { _id: usuario._id },
                {
                    $set: {
                        username: username,
                        password: hashedPassword
                    }
                }
            );

            console.log(`✅ Usuario '${usuario.nombre}' configurado exitosamente`);
            console.log(`   📝 Nombre de usuario: ${username}`);
            console.log(`   🔐 Contraseña temporal: password123 (almacenada de forma segura)`);
            console.log("   " + "─".repeat(40) + "\n");
            usuariosActualizados++;
        }

        // Mostrar resumen
        console.log("\n📊 Resumen de la operación:");
        console.log("   " + "─".repeat(40));
        console.log(`   👥 Total de usuarios en el sistema: ${usuarios.length}`);
        console.log(`   ✅ Usuarios actualizados: ${usuariosActualizados}`);
        console.log(`   ⏭️  Usuarios con credenciales existentes: ${usuariosExistentes}`);
        console.log("   " + "=".repeat(40));
        
        // Mostrar credenciales de prueba
        console.log("\n🔐 Credenciales de prueba generadas:");
        console.log("   " + "─".repeat(40));
        console.log("   Para acceder al sistema, utilice las siguientes credenciales:");
        console.log("   • Nombre de usuario: Primera parte de su correo (antes de @)");
        console.log("   • Contraseña temporal: password123");
        console.log("\n   ⚠️  IMPORTANTE: Cambie su contraseña después del primer inicio de sesión");
        console.log("   " + "=".repeat(40) + "\n");

    } catch (error) {
        console.error("\n❌ Error durante la configuración de usuarios:");
        console.error(`   🔍 ${error.message}`);
        console.error("\nℹ️  Posibles causas:");
        console.error("   - Servidor de MongoDB no está en ejecución");
        console.error("   - Problemas de conexión a la base de datos");
        console.error("   - Error de autenticación\n");
    } finally {
        await client.close();
        console.log("🔌 Conexión a la base de datos cerrada correctamente");
        console.log("✨ Proceso de configuración finalizado\n");
    }
}

setupUsers();