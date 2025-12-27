# 🌐 Configuración de CORS

## 📋 Descripción

La API está configurada para manejar CORS (Cross-Origin Resource Sharing) de manera flexible y segura. Esto permite que aplicaciones frontend en diferentes dominios puedan consumir la API.

## ⚙️ Configuración por Defecto

### URLs Permitidas por Defecto:

- `http://localhost:3000` (React, Next.js)
- `http://localhost:3001` (React alternativo)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue.js)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

### Configuración CORS:

- **Métodos permitidos:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers permitidos:** Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma
- **Headers expuestos:** X-Total-Count, X-Page-Count
- **Credentials:** Habilitado por defecto

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Configuración de la aplicación
APP_NAME=ecommerce-api
NODE_ENV=development
PORT=4000

# Base de datos
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# Swagger
SWAGGER_ENABLED=true

# CORS Configuration
CORS_ENABLED=true
CORS_CREDENTIALS=true

# URLs permitidas para CORS (separadas por comas)
# Ejemplo: http://localhost:3000,https://mi-app.com,http://localhost:8080
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8080
```

## 📝 Ejemplos de Configuración

### 1. Desarrollo Local

```bash
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 2. Desarrollo con Múltiples Puertos

```bash
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8080
```

### 3. Producción

```bash
CORS_ORIGIN=https://mi-app.com,https://www.mi-app.com,https://admin.mi-app.com
```

### 4. Deshabilitar CORS (No recomendado)

```bash
CORS_ENABLED=false
```

## 🚀 Uso en Frontend

### JavaScript/TypeScript

```javascript
// Configuración básica para fetch
const response = await fetch("http://localhost:4000/api/v1/products", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    // Incluir credentials si es necesario
  },
  credentials: "include", // Para enviar cookies
});

const data = await response.json();
```

### React con Axios

```javascript
import axios from "axios";

// Configuración base
const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // Para incluir cookies
});

// Uso
const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Vue.js con Axios

```javascript
// main.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;

// Uso en componente
export default {
  async mounted() {
    try {
      const response = await axios.get("/products");
      this.products = response.data.data;
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
```

## 🔒 Consideraciones de Seguridad

### Desarrollo

- ✅ Permite localhost y 127.0.0.1
- ✅ Incluye puertos comunes de desarrollo
- ✅ Credentials habilitado para testing

### Producción

- ⚠️ **Importante:** Solo incluir dominios de producción
- ⚠️ **No usar:** `origin: true` o `origin: "*"`
- ⚠️ **Verificar:** Que todos los dominios sean HTTPS en producción

### Ejemplo de Configuración Segura para Producción:

```bash
CORS_ORIGIN=https://mi-app.com,https://www.mi-app.com,https://admin.mi-app.com
CORS_CREDENTIALS=true
```

## 🛠️ Solución de Problemas

### Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solución:**

1. Verificar que la URL esté en `CORS_ORIGIN`
2. Asegurarse de que `CORS_ENABLED=true`
3. Reiniciar el servidor después de cambiar variables de entorno

### Error: "Credentials flag is 'true', but the 'Access-Control-Allow-Credentials' header is not set"

**Solución:**

1. Verificar que `CORS_CREDENTIALS=true`
2. Asegurarse de que el frontend use `credentials: 'include'`

### Error: "Request header field authorization is not allowed by Access-Control-Allow-Headers"

**Solución:**
La configuración ya incluye `Authorization` en los headers permitidos. Si necesitas más headers, modifica `main.ts`.

## 📊 Testing CORS

### Con cURL

```bash
# Test OPTIONS request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  http://localhost:4000/api/v1/products
```

### Con JavaScript en Browser Console

```javascript
// Test desde http://localhost:3000
fetch("http://localhost:4000/api/v1/products")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("CORS Error:", error));
```

## 🔄 Agregar Nuevas URLs

Para agregar nuevas URLs permitidas:

1. **Opción 1: Variables de entorno**

   ```bash
   CORS_ORIGIN=http://localhost:3000,https://mi-nueva-app.com
   ```

2. **Opción 2: Modificar configuración por defecto**
   Editar `src/common/config/configuration.ts` y agregar la nueva URL al array por defecto.

## 📚 Recursos Adicionales

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [NestJS CORS Documentation](https://docs.nestjs.com/security/cors)
- [CORS Best Practices](https://web.dev/cross-origin-resource-sharing/)

---

**Nota:** Después de modificar las variables de entorno, reinicia el servidor para que los cambios tomen efecto.
