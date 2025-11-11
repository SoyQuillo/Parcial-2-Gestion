import { checkSchema } from "express-validator";

export const apuestaPost = checkSchema({
    usuarioId: {
        notEmpty: true,
        errorMessage: "El ID de usuario es requerido",
        isMongoId: {
            errorMessage: "ID de usuario no válido"
        }
    },
    eventoId: {
        notEmpty: true,
        errorMessage: "El ID de evento es requerido",
        isMongoId: {
            errorMessage: "ID de evento no válido"
        }
    },
    monto: {
        isFloat: {
            options: { min: 0.01 },
            errorMessage: "El monto debe ser un número positivo"
        },
        toFloat: true
    },
    prediccion: {
        notEmpty: true,
        errorMessage: "La predicción es requerida",
        // Aquí puedes personalizar según los tipos de apuestas que manejes
        // Por ejemplo, si es un partido de fútbol podrías validar '1', 'X', '2'
        isIn: {
            options: [['1', 'X', '2']], // Ejemplo para apuestas 1X2
            errorMessage: "Predicción no válida"
        }
    },
    cuota: {
        isFloat: {
            options: { min: 1.0 },
            errorMessage: "La cuota debe ser mayor o igual a 1.0"
        },
        toFloat: true
    },
    estado: {
        optional: true,
        isIn: {
            options: [['pendiente', 'ganada', 'perdida', 'cancelada']],
            errorMessage: "Estado de apuesta no válido"
        }
    }
}, ["body"]);

export const apuestaUpdate = checkSchema({
    monto: {
        optional: true,
        isFloat: {
            options: { min: 0.01 },
            errorMessage: "El monto debe ser un número positivo"
        },
        toFloat: true
    },
    prediccion: {
        optional: true,
        isIn: {
            options: [['1', 'X', '2']],
            errorMessage: "Predicción no válida"
        }
    },
    cuota: {
        optional: true,
        isFloat: {
            options: { min: 1.0 },
            errorMessage: "La cuota debe ser mayor o igual a 1.0"
        },
        toFloat: true
    },
    estado: {
        optional: true,
        isIn: {
            options: [['pendiente', 'ganada', 'perdida', 'cancelada']],
            errorMessage: "Estado de apuesta no válido"
        }
    }
}, ["body"]);

export const apuestaActualizarEstado = checkSchema({
    id: {
        notEmpty: {
            errorMessage: "El ID de la apuesta es requerido"
        },
        isMongoId: {
            errorMessage: "El ID debe ser un MongoDB ObjectId válido"
        }
    },
    estado: {
        notEmpty: {
            errorMessage: "El estado es requerido"
        },
        isIn: {
            options: [['ganada', 'perdida']],
            errorMessage: "El estado debe ser 'ganada' o 'perdida'"
        },
        trim: true,
        toLowerCase: true
    }
}, ["body"]);

export default {
    apuestaPost,
    apuestaUpdate,
    apuestaActualizarEstado
};
