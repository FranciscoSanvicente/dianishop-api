# 📄 Guía de Paginación y Filtrado - Categorías y Marcas

## 🚀 Nuevas Funcionalidades Implementadas

Se ha implementado paginación y filtrado para los módulos de **Categorías** y **Marcas**, siguiendo el mismo patrón que el módulo de Productos.

---

## 📦 Módulo de Categorías

### 🔗 Endpoint Principal

```
GET /api/v1/categories
```

### 🔍 Parámetros de Filtrado y Paginación

| Parámetro   | Tipo   | Descripción                                             | Ejemplo              |
| ----------- | ------ | ------------------------------------------------------- | -------------------- |
| `page`      | number | Número de página (por defecto: 1)                       | `?page=2`            |
| `limit`     | number | Elementos por página (por defecto: 20, máximo: 100)     | `?limit=10`          |
| `name`      | string | Filtrar por nombre (búsqueda parcial, case-insensitive) | `?name=electrónicos` |
| `slug`      | string | Filtrar por slug (búsqueda parcial, case-insensitive)   | `?slug=electronics`  |
| `sortBy`    | enum   | Campo por el cual ordenar                               | `?sortBy=name`       |
| `sortOrder` | enum   | Orden de clasificación (ASC/DESC)                       | `?sortOrder=DESC`    |

### 📊 Campos de Ordenamiento Disponibles

- `id` - ID de la categoría
- `name` - Nombre de la categoría
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

### 💡 Ejemplos de Uso

#### 1. Obtener todas las categorías (paginación básica)

```bash
GET /api/v1/categories
```

#### 2. Paginación personalizada

```bash
GET /api/v1/categories?page=2&limit=5
```

#### 3. Filtrar por nombre

```bash
GET /api/v1/categories?name=electrónicos
```

#### 4. Filtrar por slug

```bash
GET /api/v1/categories?slug=electronics
```

#### 5. Ordenar por nombre descendente

```bash
GET /api/v1/categories?sortBy=name&sortOrder=DESC
```

#### 6. Combinación completa

```bash
GET /api/v1/categories?page=1&limit=10&name=tech&sortBy=createdAt&sortOrder=DESC
```

### 📋 Respuesta de Ejemplo

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Electrónicos",
        "slug": "electronics",
        "image": "https://example.com/image.jpg"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 🏷️ Módulo de Marcas

### 🔗 Endpoint Principal

```
GET /api/v1/brands
```

### 🔍 Parámetros de Filtrado y Paginación

| Parámetro   | Tipo   | Descripción                                             | Ejemplo           |
| ----------- | ------ | ------------------------------------------------------- | ----------------- |
| `page`      | number | Número de página (por defecto: 1)                       | `?page=2`         |
| `limit`     | number | Elementos por página (por defecto: 20, máximo: 100)     | `?limit=10`       |
| `name`      | string | Filtrar por nombre (búsqueda parcial, case-insensitive) | `?name=apple`     |
| `sortBy`    | enum   | Campo por el cual ordenar                               | `?sortBy=name`    |
| `sortOrder` | enum   | Orden de clasificación (ASC/DESC)                       | `?sortOrder=DESC` |

### 📊 Campos de Ordenamiento Disponibles

- `id` - ID de la marca
- `name` - Nombre de la marca
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

### 💡 Ejemplos de Uso

#### 1. Obtener todas las marcas (paginación básica)

```bash
GET /api/v1/brands
```

#### 2. Paginación personalizada

```bash
GET /api/v1/brands?page=2&limit=5
```

#### 3. Filtrar por nombre

```bash
GET /api/v1/brands?name=apple
```

#### 4. Ordenar por nombre ascendente

```bash
GET /api/v1/brands?sortBy=name&sortOrder=ASC
```

#### 5. Combinación completa

```bash
GET /api/v1/brands?page=1&limit=15&name=tech&sortBy=createdAt&sortOrder=DESC
```

### 📋 Respuesta de Ejemplo

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Apple"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

## 🔧 Configuración Técnica

### 📁 Archivos Modificados

#### Categorías

- `src/modules/categories/dto/filter-categories.dto.ts` - **NUEVO**
- `src/modules/categories/categories.service.ts` - **MODIFICADO**
- `src/modules/categories/categories.controller.ts` - **MODIFICADO**

#### Marcas

- `src/modules/brands/dto/filter-brands.dto.ts` - **NUEVO**
- `src/modules/brands/brands.service.ts` - **MODIFICADO**
- `src/modules/brands/brands.controller.ts` - **MODIFICADO**

### 🛠️ Características Implementadas

#### ✅ Paginación

- Página actual y límite de elementos
- Cálculo automático de páginas totales
- Límite máximo de 100 elementos por página

#### ✅ Filtrado

- **Categorías:** Filtrado por nombre y slug
- **Marcas:** Filtrado por nombre
- Búsqueda parcial (case-insensitive) usando `ILIKE`

#### ✅ Ordenamiento

- Ordenamiento por múltiples campos
- Dirección ASC/DESC configurable
- Valores por defecto sensatos

#### ✅ Documentación Swagger

- Documentación automática de todos los parámetros
- Ejemplos de uso en Swagger UI
- Tags organizados por módulo

#### ✅ Validación

- Validación de tipos de datos
- Rangos de valores (página > 0, límite 1-100)
- Enums para ordenamiento

---

## 🧪 Testing

### Con cURL

#### Test Categorías

```bash
# Paginación básica
curl "http://localhost:4000/api/v1/categories?page=1&limit=5"

# Filtrado por nombre
curl "http://localhost:4000/api/v1/categories?name=electrónicos"

# Ordenamiento
curl "http://localhost:4000/api/v1/categories?sortBy=name&sortOrder=DESC"
```

#### Test Marcas

```bash
# Paginación básica
curl "http://localhost:4000/api/v1/brands?page=1&limit=5"

# Filtrado por nombre
curl "http://localhost:4000/api/v1/brands?name=apple"

# Ordenamiento
curl "http://localhost:4000/api/v1/brands?sortBy=name&sortOrder=ASC"
```

### Con JavaScript/Fetch

```javascript
// Obtener categorías con filtros
const response = await fetch(
  "/api/v1/categories?page=1&limit=10&name=tech&sortBy=name&sortOrder=ASC",
);
const data = await response.json();
console.log(data);

// Obtener marcas con filtros
const brandsResponse = await fetch("/api/v1/brands?page=1&limit=15&name=apple");
const brandsData = await brandsResponse.json();
console.log(brandsData);
```

---

## 📚 Documentación Swagger

Accede a la documentación interactiva en:

```
http://localhost:4000/api/v1/docs
```

Los nuevos endpoints aparecerán en las secciones:

- **categories** - Para endpoints de categorías
- **brands** - Para endpoints de marcas

---

## 🎯 Beneficios

### Para Desarrolladores Frontend

- ✅ Paginación consistente en toda la API
- ✅ Filtrado flexible y potente
- ✅ Respuestas estructuradas y predecibles
- ✅ Documentación automática

### Para Performance

- ✅ Consultas optimizadas con límites
- ✅ Búsquedas eficientes con índices
- ✅ Menos transferencia de datos

### Para UX

- ✅ Carga rápida de listas grandes
- ✅ Búsqueda en tiempo real
- ✅ Navegación intuitiva

---

## 🔄 Compatibilidad

### ✅ Retrocompatibilidad

- Los endpoints existentes siguen funcionando
- No se rompen integraciones existentes
- Parámetros opcionales con valores por defecto

### ✅ Consistencia

- Mismo patrón que el módulo de productos
- Estructura de respuesta idéntica
- Nomenclatura consistente

---

**¡La implementación está lista para usar! 🚀**
