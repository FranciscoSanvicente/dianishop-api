# 🔐 Variables de Entorno - E-commerce API

## 📋 Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# ========================================
# E-COMMERCE API - ENVIRONMENT VARIABLES
# ========================================

# Application Configuration
APP_NAME=ecommerce-api
NODE_ENV=development
PORT=4000

# Database Configuration
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# Swagger Documentation
# Set to 'false' to disable Swagger in production
SWAGGER_ENABLED=true

# CORS Configuration
CORS_ENABLED=true
CORS_CREDENTIALS=true

# CORS Allowed Origins (comma-separated)
# Add your frontend URLs here
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8080

# ========================================
# CLOUDINARY CONFIGURATION
# ========================================
# Sign up at: https://cloudinary.com

CLOUDINARY_CLOUD_NAME=dyfvo7wal
CLOUDINARY_API_KEY=322959825232166
CLOUDINARY_API_SECRET=hLySmMhfiaPWu3JEpwl2YDeEbqo
```

---

## 📝 Descripción de Variables

### Application

| Variable   | Tipo   | Requerido | Descripción                           | Default       |
| ---------- | ------ | --------- | ------------------------------------- | ------------- |
| `APP_NAME` | string | No        | Nombre de la aplicación               | ecommerce-api |
| `NODE_ENV` | string | No        | Entorno de ejecución                  | development   |
| `PORT`     | number | No        | Puerto donde se ejecuta la aplicación | 4000          |

### Database

| Variable       | Tipo   | Requerido | Descripción                  |
| -------------- | ------ | --------- | ---------------------------- |
| `DATABASE_URL` | string | **Sí**    | URL de conexión a PostgreSQL |

**Formato de DATABASE_URL:**

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

**Ejemplo:**

```
postgresql://myuser:mypassword@localhost:5432/ecommerce_db
```

### Swagger

| Variable          | Tipo    | Requerido | Descripción                  | Default |
| ----------------- | ------- | --------- | ---------------------------- | ------- |
| `SWAGGER_ENABLED` | boolean | No        | Habilita/deshabilita Swagger | true    |

**Valores:** `true` o `false`

### CORS

| Variable           | Tipo    | Requerido | Descripción                       | Default   |
| ------------------ | ------- | --------- | --------------------------------- | --------- |
| `CORS_ENABLED`     | boolean | No        | Habilita/deshabilita CORS         | true      |
| `CORS_CREDENTIALS` | boolean | No        | Permite envío de credentials      | true      |
| `CORS_ORIGIN`      | string  | No        | URLs permitidas (separadas por ,) | Ver abajo |

**CORS_ORIGIN Default:**

```
http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:3001
```

### Cloudinary

| Variable                | Tipo   | Requerido | Descripción                      |
| ----------------------- | ------ | --------- | -------------------------------- |
| `CLOUDINARY_CLOUD_NAME` | string | **Sí\***  | Nombre de tu cloud en Cloudinary |
| `CLOUDINARY_API_KEY`    | string | **Sí\***  | API Key de Cloudinary            |
| `CLOUDINARY_API_SECRET` | string | **Sí\***  | API Secret de Cloudinary         |

**\*Requerido solo si usas el módulo de upload**

---

## 🚀 Configuración por Entorno

### Desarrollo Local

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_dev
SWAGGER_ENABLED=true
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Testing

```bash
NODE_ENV=test
PORT=4001
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_test
SWAGGER_ENABLED=false
CORS_ENABLED=true
```

### Producción

```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@production-host.com:5432/ecommerce_prod
SWAGGER_ENABLED=false
CORS_ENABLED=true
CORS_CREDENTIALS=true
CORS_ORIGIN=https://mi-app.com,https://www.mi-app.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔒 Seguridad

### ⚠️ Importante

1. **Nunca** subas el archivo `.env` a Git
2. **Nunca** compartas tus credenciales de base de datos o Cloudinary
3. Usa diferentes credenciales para desarrollo y producción
4. Rota regularmente tus API secrets
5. En producción, usa solo URLs HTTPS en `CORS_ORIGIN`

### Archivo .gitignore

Asegúrate de que `.env` esté en tu `.gitignore`:

```
.env
.env.local
.env.*.local
```

---

## 🛠️ Obtener Credenciales

### Base de Datos PostgreSQL

**Opción 1: Local**

```bash
# Instalar PostgreSQL
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Crear base de datos
createdb ecommerce_db
```

**Opción 2: Servicios en la Nube**

- [Neon](https://neon.tech) - PostgreSQL serverless
- [Supabase](https://supabase.com) - PostgreSQL con extras
- [Railway](https://railway.app) - PostgreSQL managed
- [ElephantSQL](https://www.elephantsql.com) - PostgreSQL as a Service

### Cloudinary

1. Regístrate en [Cloudinary](https://cloudinary.com)
2. Ve a tu [Dashboard](https://cloudinary.com/console)
3. Copia tus credenciales:
   - Cloud Name
   - API Key
   - API Secret

**Plan Gratuito incluye:**

- 25 GB de almacenamiento
- 25 GB de ancho de banda/mes
- Todas las transformaciones

---

## 📚 Referencias

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

---

**Fecha de última actualización:** Enero 2024
