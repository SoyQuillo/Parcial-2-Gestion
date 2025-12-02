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
                msg: "Usuario y contraseña son requeridos"
            });
        }

        // Buscar usuario en MongoDB
        const usuario = await findUsuarioByUsernameOrEmail(username);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: "Credenciales inválidas"
            });
        }

        // Validar contraseña con bcrypt
        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                msg: "Credenciales inválidas"
            });
        }

        // Generar OTP de 6 dígitos
        const otp = generateOTP();

        // Almacenar OTP en Redis con expiración de 5 minutos
        await saveOTP(username, otp);

        // Enviar OTP al correo del usuario
        const emailSubject = "Código de verificación OTP";
        const emailMessage = `
            <h1>Código de verificación</h1>
            <p>Tu código OTP es: <strong>${otp}</strong></p>
            <p>Este código expira en 5 minutos.</p>
        `;

        try {
            await sendMail(usuario.correo, emailSubject, emailMessage);
        } catch (emailError) {
            console.error("Error enviando correo:", emailError);
            // Continuar aunque falle el envío de correo (para desarrollo)
        }

        // Responder confirmando que la OTP fue enviada
        return res.status(200).json({
            success: true,
            msg: "OTP enviada al correo electrónico",
            // No se entrega el token aún
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor"
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
                msg: "Usuario y OTP son requeridos"
            });
        }

        // Buscar OTP en Redis
        const otpData = await getOTP(username);

        if (!otpData) {
            return res.status(401).json({
                success: false,
                msg: "OTP no encontrada o expirada"
            });
        }

        // Validar coincidencia de OTP
        if (otpData.otp !== otp) {
            return res.status(401).json({
                success: false,
                msg: "OTP incorrecta"
            });
        }

        // OTP válida - eliminar de Redis
        await deleteOTP(username);

        // Obtener datos del usuario
        const usuario = await findUsuarioByUsernameOrEmail(username);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: "Usuario no encontrado"
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
            msg: "Autenticación exitosa"
        });

    } catch (error) {
        console.error("Error en verify-otp:", error);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor"
        });
    }
};
