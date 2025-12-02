import jwt from "jsonwebtoken";

const JWT_SECRET = 'millavesecreta123*-';

export const verifyToken = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                msg: "Token no proporcionado. Se requiere Authorization: Bearer <token>"
            });
        }

        // Separar "Bearer" del token
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                msg: "Formato de token inválido. Use: Authorization: Bearer <token>"
            });
        }

        const token = parts[1];

        // Verificar el token JWT
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                // Manejar diferentes tipos de errores
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        msg: "Token expirado"
                    });
                } else if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        success: false,
                        msg: "Token inválido"
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        msg: "Error al verificar el token"
                    });
                }
            }

            // Agregar información del usuario decodificada al request
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("Error en middleware de autenticación:", error);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor"
        });
    }
};
