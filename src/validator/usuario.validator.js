import { checkSchema } from "express-validator";

export const usuarioPost = checkSchema({
    nombre: {
        errorMessage: "Nombre inválido",
        notEmpty: true,
        isLength: {
            options: { min: 3, max: 100 },
            errorMessage: "El nombre debe tener entre 3 y 100 caracteres"
        },
        trim: true
    },
    correo: {
        isEmail: {
            errorMessage: "El correo no es válido"
        },
        normalizeEmail: true,
        trim: true
    },
    saldo: {
        isInt: {
            options: { min: 0, max: 9999999999 },
            errorMessage: "El saldo debe ser un número entre 0 y 9,999,999,999"
        },
        toInt: true
    },
    pais: {
        optional: true,
        trim: true,
        isString: true,
        errorMessage: "País no válido"
    }
}, ["body"]);

export const usuarioUpdate = checkSchema({
    nombre: {
        optional: true,
        isLength: {
            options: { min: 3, max: 100 },
            errorMessage: "El nombre debe tener entre 3 y 100 caracteres"
        },
        trim: true
    },
    correo: {
        optional: true,
        isEmail: {
            errorMessage: "El correo no es válido"
        },
        normalizeEmail: true,
        trim: true
    },
    saldo: {
        optional: true,
        isInt: {
            options: { min: 0, max: 9999999999 },
            errorMessage: "El saldo debe ser un número entre 0 y 9,999,999,999"
        },
        toInt: true
    },
    pais: {
        optional: true,
        trim: true,
        isString: true,
        errorMessage: "País no válido"
    }
}, ["body"]);

export const usuarioActualizarSaldo = checkSchema({
    id: {
        notEmpty: {
            errorMessage: "El ID del usuario es requerido"
        },
        isMongoId: {
            errorMessage: "El ID debe ser un MongoDB ObjectId válido"
        }
    },
    ganancia: {
        notEmpty: {
            errorMessage: "La ganancia es requerida"
        },
        isFloat: {
            errorMessage: "La ganancia debe ser un número válido"
        },
        custom: {
            options: (value) => {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    throw new Error("La ganancia debe ser un número válido");
                }
                if (numValue < -9999999999 || numValue > 9999999999) {
                    throw new Error("La ganancia debe estar entre -9,999,999,999 y 9,999,999,999");
                }
                return true;
            }
        }
    }
}, ["body"]);

export const usuarioEliminar = checkSchema({
    id: {
        notEmpty: {
            errorMessage: "El ID del usuario es requerido"
        },
        isMongoId: {
            errorMessage: "El ID debe ser un MongoDB ObjectId válido"
        }
    },
    eliminarApuestas: {
        optional: true,
        isBoolean: {
            strict: true,
            errorMessage: "eliminarApuestas debe ser true o false"
        },
        toBoolean: true
    }
}, ["body"]);

export default {
    usuarioPost,
    usuarioUpdate,
    usuarioActualizarSaldo,
    usuarioEliminar
};
