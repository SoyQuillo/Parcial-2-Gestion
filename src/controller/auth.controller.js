import { generateToken } from "../services/token.service.js";
import { findUsuarioByUsernameOrEmail } from "../model/usuario.model.js";
import bcrypt from "bcrypt";
import { saveOTP, getOTP, deleteOTP } from "../services/redis.service.js";
import { sendMail } from "../services/mail.service.js";

// Generar OTP de 6 dígitos
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /auth/login - Generación de OTP
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que se envíen los campos requeridos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                msg: "Por favor proporcione tanto el nombre de usuario como la contraseña para continuar"
            });
        }

        // Buscar usuario en MongoDB
        const usuario = await findUsuarioByUsernameOrEmail(username);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: "No se encontró una cuenta asociada a este nombre de usuario"
            });
        }

        // Validar contraseña con bcrypt
        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                msg: "La contraseña proporcionada no es correcta"
            });
        }

        // Generar OTP de 6 dígitos
        const otp = generateOTP();

        // Almacenar OTP en Redis con expiración de 5 minutos
        await saveOTP(username, otp);

        // Mostrar OTP en consola para desarrollo
        console.log(`\n========================================`);
        console.log(`🔐 OTP GENERADA PARA: ${username}`);
        console.log(`📝 CÓDIGO: ${otp}`);
        console.log(`⏱️  EXPIRA EN: 5 minutos`);
        console.log(`========================================\n`);

        // Responder confirmando que la OTP fue generada
        return res.status(200).json({
            success: true,
            msg: "Se ha generado un código de verificación. Revisa la consola del servidor para obtenerlo.",
            // No se entrega el token aún
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            msg: "Hemos experimentado un problema inesperado. Nuestro equipo ha sido notificado."
        });
    }
};

// POST /auth/verify-otp - Validación de OTP y entrega del token
export const verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;

        // Validar que se envíen los campos requeridos
        if (!username || !otp) {
            return res.status(400).json({
                success: false,
                msg: "Se requieren tanto el nombre de usuario como el código de verificación para continuar"
            });
        }

        // Buscar OTP en Redis
        const otpData = await getOTP(username);

        if (!otpData) {
            return res.status(401).json({
                success: false,
                msg: "El código de verificación no es válido o ha expirado. Por favor solicita uno nuevo"
            });
        }

        // Validar coincidencia de OTP
        if (otpData.otp !== otp) {
            return res.status(401).json({
                success: false,
                msg: "El código de verificación ingresado no es correcto. Por favor inténtalo de nuevo"
            });
        }

        // OTP válida - eliminar de Redis
        await deleteOTP(username);

        // Obtener datos del usuario
        const usuario = await findUsuarioByUsernameOrEmail(username);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: "No se encontró ninguna cuenta asociada a estas credenciales"
            });
        }

        // Generar JWT
        const token = generateToken({
            username: usuario.username || usuario.correo,
            userId: usuario._id.toString()
        });

        // Calcular tiempo de expiración (1 hora = 3600 segundos)
        const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);

        // Enviar respuesta con token, expiración y datos del usuario
        return res.status(200).json({
            success: true,
            token: token,
            expiresIn: expirationTime,
            user: {
                id: usuario._id,
                username: usuario.username || usuario.correo,
                correo: usuario.correo,
                nombre: usuario.nombre
            },
            msg: "¡Inicio de sesión exitoso! Bienvenido de nuevo"
        });

    } catch (error) {
        console.error("Error en verify-otp:", error);
        return res.status(500).json({
            success: false,
            msg: "Hemos experimentado un problema inesperado. Nuestro equipo ha sido notificado."
        });
    }
};
