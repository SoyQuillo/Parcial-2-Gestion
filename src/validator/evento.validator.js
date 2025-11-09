import { checkSchema } from "express-validator";

export const eventoPost = checkSchema({
    nombre: {
        notEmpty: true,
        errorMessage: "El nombre del evento es requerido",
        isLength: {
            options: { min: 3, max: 200 },
            errorMessage: "El nombre debe tener entre 3 y 200 caracteres"
        },
        trim: true
    },
    fecha: {
        isISO8601: {
            errorMessage: "La fecha debe tener un formato válido (YYYY-MM-DD)"
        },
        custom: {
            options: (value) => {
                const today = new Date();
                const eventDate = new Date(value);
                return eventDate > today;
            },
            errorMessage: "La fecha del evento debe ser futura"
        }
    },
    descripcion: {
        optional: true,
        isLength: {
            options: { max: 1000 },
            errorMessage: "La descripción no puede tener más de 1000 caracteres"
        },
        trim: true
    },
    estado: {
        optional: true,
        isIn: {
            options: [['pendiente', 'en_curso', 'finalizado', 'cancelado']],
            errorMessage: "Estado no válido"
        }
    },
    participantesMaximos: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "El número máximo de participantes debe ser un número positivo"
        },
        toInt: true
    }
}, ["body"]);

export const eventoUpdate = checkSchema({
    nombre: {
        optional: true,
        isLength: {
            options: { min: 3, max: 200 },
            errorMessage: "El nombre debe tener entre 3 y 200 caracteres"
        },
        trim: true
    },
    fecha: {
        optional: true,
        isISO8601: {
            errorMessage: "La fecha debe tener un formato válido (YYYY-MM-DD)"
        },
        custom: {
            options: (value) => {
                const today = new Date();
                const eventDate = new Date(value);
                return eventDate > today;
            },
            errorMessage: "La fecha del evento debe ser futura"
        }
    },
    descripcion: {
        optional: true,
        isLength: {
            options: { max: 1000 },
            errorMessage: "La descripción no puede tener más de 1000 caracteres"
        },
        trim: true
    },
    estado: {
        optional: true,
        isIn: {
            options: [['pendiente', 'en_curso', 'finalizado', 'cancelado']],
            errorMessage: "Estado no válido"
        }
    },
    participantesMaximos: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "El número máximo de participantes debe ser un número positivo"
        },
        toInt: true
    }
}, ["body"]);

export default {
    eventoPost,
    eventoUpdate
};
