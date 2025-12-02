import { createClient } from 'redis';

console.log('🔍 Iniciando verificación de conexión al servidor Redis...\n');

const client = createClient({
    url: 'redis://localhost:6379',
    socket: {
        connectTimeout: 3000
    }
});

try {
    console.log('🔄 Estableciendo conexión con el servidor Redis...');
    await client.connect();
    const result = await client.ping();
    
    if (result === 'PONG') {
        console.log('✅ Conexión exitosa: El servidor Redis está funcionando correctamente');
        console.log('📍 Servidor: localhost:6379\n');
        
        // Probar operaciones básicas
        console.log('🧪 Realizando prueba de escritura/lectura...');
        await client.setEx('test:connection:key', 10, 'test-value');
        const value = await client.get('test:connection:key');
        await client.del('test:connection:key');
        
        if (value === 'test-value') {
            console.log('✅ Prueba exitosa: Las operaciones de lectura y escritura funcionan correctamente\n');
            console.log('📊 Estado del servidor:');
            const info = await client.info('server');
            console.log(info.split('\r\n').filter(line => line && !line.startsWith('#')));
        } else {
            console.warn('⚠️ Advertencia: La prueba de lectura/escritura no devolvió el valor esperado');
        }
    }
    
    console.log('\n🔌 Cerrando conexión con Redis...');
    await client.quit();
    console.log('✅ Verificación completada con éxito\n');
    process.exit(0);
} catch (error) {
    console.error('\n❌ Error de conexión: No se pudo establecer conexión con el servidor Redis');
    console.error('🔍 Detalles del error:', error.message);
    console.log('\n📌 Por favor verifica que:');
    console.log('1. El servidor Redis esté en ejecución');
    console.log('2. El puerto 6379 esté accesible');
    console.log('3. No haya reglas de firewall bloqueando la conexión\n');
    process.exit(1);
}