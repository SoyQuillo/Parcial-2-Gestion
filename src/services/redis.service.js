import { createClient } from 'redis';


const memoryStore = new Map();
const memoryExpiry = new Map();

// Crear cliente Redis
const client = createClient({
    url: 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.warn('Redis: Máximo de reintentos alcanzado. Usando almacenamiento en memoria.');
                return false; // Detener reintentos
            }
            return Math.min(retries * 100, 3000);
        },
        connectTimeout: 5000
    }
});

let useMemoryStore = false;
let isConnected = false;
let connectionAttempted = false;

client.on('error', (err) => {
    // Solo mostrar error si no estamos usando memory store
    if (!useMemoryStore) {
        console.error('Redis Client Error:', err.message);
    }
});

client.on('connect', () => {
    console.log('Redis Client conectando...');
});

client.on('ready', () => {
    console.log('Redis Client listo y conectado');
    useMemoryStore = false;
    isConnected = true;
});

// Función para limpiar OTP expirados del almacenamiento en memoria
const cleanExpiredOTP = () => {
    const now = Date.now();
    for (const [key, expiry] of memoryExpiry.entries()) {
        if (now > expiry) {
            memoryStore.delete(key);
            memoryExpiry.delete(key);
        }
    }
};

// Limpiar cada minuto
setInterval(cleanExpiredOTP, 60000);

export const connectRedis = async () => {
    // Si ya estamos usando memory store, no intentar conectar
    if (useMemoryStore) {
        return null; // Retornar null indica que usamos memory store
    }

    if (!isConnected && !connectionAttempted) {
        connectionAttempted = true;
        try {
            if (!client.isOpen) {
                // Intentar conectar con timeout
                await Promise.race([
                    client.connect(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout de conexión')), 5000)
                    )
                ]);
            }
            isConnected = true;
            useMemoryStore = false;
            console.log('Redis conectado exitosamente');
            return client;
        } catch (error) {
            console.warn('No se pudo conectar a Redis:', error.message);
            
            useMemoryStore = true;
            isConnected = false;
            connectionAttempted = false;
            return null; // Retornar null indica memory store
        }
    }
    
    if (client.isOpen) {
        return client;
    }
    
    return null;
};

// Guardar OTP en Redis o memoria con expiración de 5 minutos (300 segundos)
export const saveOTP = async (username, otp) => {
    const redisClient = await connectRedis();
    
    const otpData = {
        otp: otp,
        expiraEn: 300
    };

    if (redisClient) {
        // Usar Redis
        try {
            await redisClient.setEx(`otp:${username}`, 300, JSON.stringify(otpData));
            return true;
        } catch (error) {
            console.error(' Error guardando OTP en Redis:', error.message);
            throw new Error(`No se pudo guardar OTP: ${error.message}`);
        }
    } else {
        // Usar almacenamiento en memoria
        const key = `otp:${username}`;
        memoryStore.set(key, JSON.stringify(otpData));
        memoryExpiry.set(key, Date.now() + 300000); // 5 minutos en milisegundos
        console.log(`OTP guardada en memoria para ${username} (expira en 5 min)`);
        return true;
    }
};

// Obtener OTP de Redis o memoria
export const getOTP = async (username) => {
    const redisClient = await connectRedis();
    
    if (redisClient) {
        // Usar Redis
        try {
            const otpData = await redisClient.get(`otp:${username}`);
            if (otpData) {
                return JSON.parse(otpData);
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo OTP de Redis:', error.message);
            throw new Error(`No se pudo obtener OTP: ${error.message}`);
        }
    } else {
        // Usar almacenamiento en memoria
        const key = `otp:${username}`;
        cleanExpiredOTP(); // Limpiar expirados antes de buscar
        
        if (memoryExpiry.has(key) && Date.now() > memoryExpiry.get(key)) {
            // OTP expirado
            memoryStore.delete(key);
            memoryExpiry.delete(key);
            return null;
        }
        
        const otpData = memoryStore.get(key);
        if (otpData) {
            return JSON.parse(otpData);
        }
        return null;
    }
};

// Eliminar OTP de Redis o memoria
export const deleteOTP = async (username) => {
    const redisClient = await connectRedis();
    
    if (redisClient) {
        // Usar Redis
        try {
            await redisClient.del(`otp:${username}`);
            return true;
        } catch (error) {
            console.error('Error eliminando OTP de Redis:', error.message);
            throw new Error(`No se pudo eliminar OTP: ${error.message}`);
        }
    } else {
        // Usar almacenamiento en memoria
        const key = `otp:${username}`;
        memoryStore.delete(key);
        memoryExpiry.delete(key);
        return true;
    }
};
