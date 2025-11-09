# Guía de Endpoints - API de Apuestas

## Base URL: `http://localhost:3000`

---

## 📋 APUESTAS (`/apuesta`)

### GET - Consultas
- **Todas las apuestas**: `GET /apuesta`
- **Apuestas en curso (con proyección)**: `GET /apuesta?estado=en curso`
- **Total apostado por usuario**: `GET /apuesta?total_apostado=true`
- **Usuarios con mayor ganancia**: `GET /apuesta?mayor_ganancia=true`
- **Apuestas completas (con $lookup)**: `GET /apuesta?completa=true`

### POST - Crear
- **Crear apuesta**: `POST /apuesta`
  ```json
  {
    "usuario": "690fb74c0de5a3dd925228f8",
    "evento": "690fb7f0e679e6b2e8fa8c33",
    "monto_apostado": 100.00,
    "tipo_apuesta": "local",
    "cuota_aplicada": 2.10,
    "posible_ganancia": 210.00,
    "estado": "en curso"
  }
  ```
- **Crear múltiples apuestas**: `POST /apuesta` (envía un array)

### PUT - Actualizar
- **Cambiar estado de apuesta**: `PUT /apuesta`
  ```json
  {
    "id": "apuesta_id",
    "estado": "ganada"
  }
  ```

---

## 👥 USUARIOS (`/usuario`)

### GET - Consultas
- **Todos los usuarios**: `GET /usuario`
- **Usuarios con saldo > X**: `GET /usuario?saldo=50000`
- **Usuarios que apostaron en baloncesto**: `GET /usuario?baloncesto=true`

### POST - Crear
- **Crear usuario**: `POST /usuario`
  ```json
  {
    "nombre": "Juan Pérez",
    "correo": "juan@email.com",
    "saldo": 5000.00,
    "pais": "Argentina"
  }
  ```

### PUT - Actualizar
- **Actualizar saldo (sumar ganancia)**: `PUT /usuario`
  ```json
  {
    "id": "usuario_id",
    "ganancia": 210.00
  }
  ```

### DELETE - Eliminar
- **Eliminar usuario**: `DELETE /usuario`
  ```json
  {
    "id": "usuario_id",
    "eliminarApuestas": false
  }
  ```

---

## 🏆 EVENTOS (`/evento`)

### GET - Consultas
- **Todos los eventos**: `GET /evento`
- **Eventos por deporte**: `GET /evento?deporte=Fútbol`
- **Eventos con cuota_local > 2.0**: `GET /evento?cuota_local=true`
- **Promedio de cuotas por deporte**: `GET /evento?promedio_cuotas=true`

### POST - Crear
- **Crear evento**: `POST /evento`
  ```json
  {
    "deporte": "Fútbol",
    "fecha": "2024-11-15T20:00:00Z",
    "equipo_local": "Real Madrid",
    "equipo_visitante": "Barcelona",
    "cuota_local": 2.10,
    "cuota_empate": 3.20,
    "cuota_visitante": 3.50
  }
  ```

### PUT - Actualizar
- **Modificar cuota_visitante**: `PUT /evento`
  ```json
  {
    "id": "evento_id",
    "cuota_visitante": 3.50
  }
  ```

### DELETE - Eliminar
- **Eliminar evento finalizado**: `DELETE /evento`
  ```json
  {
    "id": "evento_id"
  }
  ```

---

## 🔧 Cómo Probar

### Opción 1: Navegador (solo GET)
Abre en tu navegador:
- `http://localhost:3000/apuesta`
- `http://localhost:3000/usuario?saldo=50000`
- `http://localhost:3000/evento?deporte=Fútbol`

### Opción 2: Postman/Insomnia
1. Abre Postman o Insomnia
2. Selecciona el método (GET, POST, PUT, DELETE)
3. Ingresa la URL completa
4. Para POST/PUT/DELETE, ve a "Body" → "JSON" y pega el JSON
5. Para GET con query params, usa la pestaña "Params"

### Opción 3: curl (Terminal)
```bash
# GET
curl http://localhost:3000/apuesta

# GET con query params
curl "http://localhost:3000/usuario?saldo=50000"

# POST
curl -X POST http://localhost:3000/apuesta \
  -H "Content-Type: application/json" \
  -d '{"usuario":"id","evento":"id","monto_apostado":100}'

# PUT
curl -X PUT http://localhost:3000/apuesta \
  -H "Content-Type: application/json" \
  -d '{"id":"apuesta_id","estado":"ganada"}'

# DELETE
curl -X DELETE http://localhost:3000/usuario \
  -H "Content-Type: application/json" \
  -d '{"id":"usuario_id"}'
```

### Opción 4: JavaScript (fetch)
```javascript
// GET
fetch('http://localhost:3000/apuesta')
  .then(res => res.json())
  .then(data => console.log(data));

// POST
fetch('http://localhost:3000/apuesta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario: "id",
    evento: "id",
    monto_apostado: 100
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📝 Notas Importantes

1. **El servidor debe estar corriendo** en el puerto 3000
2. **MongoDB debe estar activo** y la base de datos "torneo" debe existir
3. **Los IDs** deben ser ObjectIds válidos de MongoDB
4. **Query params** son opcionales, si no los envías obtienes todos los registros
5. **Content-Type** debe ser `application/json` para POST/PUT/DELETE

