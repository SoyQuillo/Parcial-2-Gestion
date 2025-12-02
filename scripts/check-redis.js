import { createClient } from 'redis';

console.log('Verificando conexión a Redis...\n');

const client = createClient({
    url: 'redis://localhost:6379',
    socket: {
        connectTimeout: 3000
    }
});

try {
    await client.connect();
    const result = await client.ping();
    
    if (result === 'PONG') {
        console.log('Redis está funcionando correctamente!');
        console.log('Conexión exitosa a localhost:6379\n');
        
        // Probar operaciones básicas
        await client.setEx('test:key', 10, 'test-value');
        const value = await client.get('test:key');
        await client.del('test:key');
        
        if (value === 'test-value') {
            console.log('Operaciones de lectura/escritura funcionando correctamente\n');
        }
    }
    
    await client.quit();
    process.exit(0);
} catch (error) {
    console.error('Redis NO está disponible\n');
    process.exit(1);
}

