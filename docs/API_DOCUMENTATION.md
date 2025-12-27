# 📚 API de E-commerce - Documentación Completa

## 🚀 Introducción

Esta API de e-commerce está construida con **NestJS** y proporciona endpoints para la gestión completa de productos, categorías y marcas. La API incluye funcionalidades avanzadas como filtrado, ordenamiento, paginación y asociaciones entre entidades.

### Módulos Disponibles

- **Productos**: CRUD completo con filtros avanzados, paginación y gestión de stock
- **Categorías**: CRUD completo con soporte para slug e imágenes
- **Marcas**: CRUD completo para gestión de marcas de productos
- **Usuarios**: CRUD completo con validaciones de seguridad, encriptación de contraseñas y filtros
- **Estados de Orden**: Endpoints de solo lectura para gestión de estados de pedidos
- **Métodos de Pago**: Endpoints de solo lectura para gestión de métodos de pago
- **Órdenes**: CRUD completo con gestión de productos asociados, transacciones y relaciones
- **Upload**: 📸 Carga de imágenes a Cloudinary con optimización y múltiples tamaños automáticos

### Base URL

```
http://localhost:4000/api/v1
```

### Documentación Swagger

```
http://localhost:4000/api/v1/docs
```

### Configuración CORS

La API está configurada para permitir requests desde:

- `http://localhost:3000` (React, Next.js)
- `http://localhost:3001` (React alternativo)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue.js)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

**Para agregar más URLs:** Configura la variable de entorno `CORS_ORIGIN` con las URLs separadas por comas.

```bash
CORS_ORIGIN=http://localhost:3000,https://mi-app.com,http://localhost:8080
```

Ver `CORS_CONFIGURATION.md` para más detalles sobre configuración de CORS.

---

## 📦 Módulo de Productos

### 🏗️ Estructura de Datos

#### Producto (Product)

```typescript
{
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
  sku?: string;
  categoryId: number;
  brandId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  images?: Array<{
    size: string;      // "150x150", "400x400", "800x800", "1200x1200", "original"
    url: string;       // URL de Cloudinary
    public_id: string; // ID público de Cloudinary (necesario para eliminar)
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔗 Endpoints de Productos

### 1. 📝 Crear Producto

**POST** `/products`

Crea un nuevo producto en el sistema.

#### Request Body

```json
{
  "name": "iPhone 15 Pro",
  "description": "El último smartphone de Apple con chip A17 Pro",
  "price": 999.99,
  "originalPrice": 1199.99,
  "rating": 4.5,
  "reviews": 128,
  "inStock": true,
  "stock": 50,
  "sku": "IPH15-PRO-256-BLU",
  "categoryId": 1,
  "brandId": 1,
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/.../iphone-150x150.jpg",
      "public_id": "ecommerce/iphone-abc123"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/.../iphone-400x400.jpg",
      "public_id": "ecommerce/iphone-abc123"
    },
    {
      "size": "800x800",
      "url": "https://res.cloudinary.com/.../iphone-800x800.jpg",
      "public_id": "ecommerce/iphone-abc123"
    },
    {
      "size": "1200x1200",
      "url": "https://res.cloudinary.com/.../iphone-1200x1200.jpg",
      "public_id": "ecommerce/iphone-abc123"
    },
    {
      "size": "original",
      "url": "https://res.cloudinary.com/.../iphone-original.jpg",
      "public_id": "ecommerce/iphone-abc123"
    }
  ]
}
```

#### Validaciones

- `name`: Requerido, 2-100 caracteres
- `description`: Opcional, máximo 1000 caracteres
- `price`: Requerido, mínimo 0.01, máximo 2 decimales
- `originalPrice`: Opcional, mínimo 0.01, máximo 2 decimales
- `rating`: Opcional, 1-5, máximo 1 decimal
- `reviews`: Opcional, entero ≥ 0
- `inStock`: Opcional, booleano
- `stock`: Opcional, entero ≥ 0
- `sku`: Opcional, 1-50 caracteres
- `categoryId`: Requerido, entero positivo
- `brandId`: Requerido, entero positivo
- `images`: Opcional, array de objetos con `size` (string), `url` (string, URL válida) y `public_id` (string, ID de Cloudinary)

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "El último smartphone de Apple con chip A17 Pro",
    "price": "999.99",
    "originalPrice": "1199.99",
    "rating": "4.5",
    "reviews": 128,
    "inStock": true,
    "stock": 50,
    "sku": "IPH15-PRO-256-BLU",
    "categoryId": 1,
    "brandId": 1,
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../iphone-150x150.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../iphone-400x400.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "800x800",
        "url": "https://res.cloudinary.com/.../iphone-800x800.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "1200x1200",
        "url": "https://res.cloudinary.com/.../iphone-1200x1200.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "original",
        "url": "https://res.cloudinary.com/.../iphone-original.jpg",
        "public_id": "ecommerce/iphone-abc123"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. 📋 Listar Productos (con Filtros y Paginación)

**GET** `/products`

Obtiene una lista paginada de productos con filtros y ordenamiento.

#### Query Parameters

| Parámetro    | Tipo    | Descripción                                         | Ejemplo          |
| ------------ | ------- | --------------------------------------------------- | ---------------- |
| `page`       | number  | Número de página (por defecto: 1)                   | `?page=2`        |
| `limit`      | number  | Elementos por página (por defecto: 20, máximo: 100) | `?limit=10`      |
| `categoryId` | number  | Filtrar por ID de categoría                         | `?categoryId=1`  |
| `brandId`    | number  | Filtrar por ID de marca                             | `?brandId=2`     |
| `minPrice`   | number  | Precio mínimo                                       | `?minPrice=100`  |
| `maxPrice`   | number  | Precio máximo                                       | `?maxPrice=500`  |
| `inStock`    | boolean | Solo productos en stock                             | `?inStock=true`  |
| `sortBy`     | string  | Campo de ordenamiento                               | `?sortBy=price`  |
| `sortOrder`  | string  | Orden (ASC/DESC)                                    | `?sortOrder=ASC` |

#### Campos de Ordenamiento Disponibles

- `createdAt` (por defecto)
- `updatedAt`
- `name`
- `price`
- `rating`

#### Ejemplos de Uso

**Básico:**

```
GET /products
```

**Con filtros:**

```
GET /products?categoryId=1&brandId=2&minPrice=100&maxPrice=500
```

**Con paginación:**

```
GET /products?page=2&limit=10
```

**Con ordenamiento:**

```
GET /products?sortBy=price&sortOrder=ASC
```

**Completo:**

```
GET /products?page=1&limit=5&categoryId=1&brandId=2&minPrice=100&maxPrice=500&inStock=true&sortBy=price&sortOrder=ASC
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "description": "El último smartphone de Apple con chip A17 Pro",
        "price": "999.99",
        "originalPrice": "1199.99",
        "rating": "4.5",
        "reviews": 128,
        "inStock": true,
        "stock": 50,
        "sku": "IPH15-PRO-256-BLU",
        "categoryId": 1,
        "brandId": 1,
        "category": {
          "id": 1,
          "name": "Smartphones",
          "slug": "smartphones"
        },
        "brand": {
          "id": 1,
          "name": "Apple"
        },
        "images": [
          {
            "size": "150x150",
            "url": "https://res.cloudinary.com/.../iphone-150x150.jpg",
            "public_id": "ecommerce/iphone-abc123"
          },
          {
            "size": "400x400",
            "url": "https://res.cloudinary.com/.../iphone-400x400.jpg",
            "public_id": "ecommerce/iphone-abc123"
          }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 5,
    "totalPages": 5
  }
}
```

---

### 3. 📦 Obtener Productos en Stock

**GET** `/products/in-stock`

Obtiene solo los productos que están disponibles en stock.

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "inStock": true,
      "stock": 50,
      "category": {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "brand": {
        "id": 1,
        "name": "Apple"
      }
    }
  ]
}
```

---

### 4. 🏷️ Obtener Productos por Categoría

**GET** `/products/category/{categoryId}`

Obtiene todos los productos de una categoría específica.

#### Path Parameters

- `categoryId`: ID de la categoría (número entero)

#### Ejemplo

```
GET /products/category/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "brand": {
        "id": 1,
        "name": "Apple"
      }
    }
  ]
}
```

---

### 5. 🏢 Obtener Productos por Marca

**GET** `/products/brand/{brandId}`

Obtiene todos los productos de una marca específica.

#### Path Parameters

- `brandId`: ID de la marca (número entero)

#### Ejemplo

```
GET /products/brand/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "brandId": 1,
      "category": {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "brand": {
        "id": 1,
        "name": "Apple"
      }
    }
  ]
}
```

---

### 6. 🔍 Obtener Producto por ID

**GET** `/products/{id}`

Obtiene un producto específico por su ID.

#### Path Parameters

- `id`: ID del producto (número entero)

#### Ejemplo

```
GET /products/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "El último smartphone de Apple con chip A17 Pro",
    "price": "999.99",
    "originalPrice": "1199.99",
    "rating": "4.5",
    "reviews": 128,
    "inStock": true,
    "stock": 50,
    "sku": "IPH15-PRO-256-BLU",
    "categoryId": 1,
    "brandId": 1,
    "category": {
      "id": 1,
      "name": "Smartphones",
      "slug": "smartphones"
    },
    "brand": {
      "id": 1,
      "name": "Apple"
    },
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../iphone-150x150.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../iphone-400x400.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "800x800",
        "url": "https://res.cloudinary.com/.../iphone-800x800.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "1200x1200",
        "url": "https://res.cloudinary.com/.../iphone-1200x1200.jpg",
        "public_id": "ecommerce/iphone-abc123"
      },
      {
        "size": "original",
        "url": "https://res.cloudinary.com/.../iphone-original.jpg",
        "public_id": "ecommerce/iphone-abc123"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Product with ID 999 not found"
  }
}
```

---

### 7. ✏️ Actualizar Producto

**PUT** `/products/{id}`

Actualiza completamente un producto existente.

#### Path Parameters

- `id`: ID del producto (número entero)

#### Request Body

```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Versión más grande del iPhone 15 Pro",
  "price": 1099.99,
  "originalPrice": 1299.99,
  "rating": 4.7,
  "reviews": 150,
  "inStock": true,
  "stock": 30,
  "sku": "IPH15-PRO-MAX-256-BLU",
  "categoryId": 1,
  "brandId": 1,
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/.../iphone-new-150x150.jpg",
      "public_id": "ecommerce/iphone-new-abc123"
    }
  ]
}
```

> **Nota sobre imágenes:** El campo `images` es opcional. Si se envía un array con elementos, se **reemplazarán** todas las imágenes anteriores. Si se envía un array vacío `[]`, se **eliminarán** todas las imágenes asociadas al producto. Si no se envía el campo, las imágenes existentes no se verán afectadas.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "description": "Versión más grande del iPhone 15 Pro",
    "price": "1099.99",
    "originalPrice": "1299.99",
    "rating": "4.7",
    "reviews": 150,
    "inStock": true,
    "stock": 30,
    "sku": "IPH15-PRO-MAX-256-BLU",
    "categoryId": 1,
    "brandId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

---

### 8. 📊 Actualizar Stock

**PATCH** `/products/{id}/stock`

Actualiza solo el stock de un producto.

#### Path Parameters

- `id`: ID del producto (número entero)

#### Request Body

```json
{
  "stock": 75
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "stock": 75,
    "inStock": true,
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

> **Nota:** El campo `inStock` se actualiza automáticamente a `true` si `stock > 0`, o `false` si `stock = 0`.

---

### 9. 🗑️ Eliminar Producto

**DELETE** `/products/{id}`

Elimina un producto del sistema.

#### Path Parameters

- `id`: ID del producto (número entero)

#### Ejemplo

```
DELETE /products/1
```

#### Response (204 No Content)

```
(No content)
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/999",
  "method": "DELETE",
  "statusCode": 404,
  "error": {
    "message": "Product with ID 999 not found"
  }
}
```

---

## 🏷️ Módulo de Categorías

### 🏗️ Estructura de Datos

#### Categoría (Category)

```typescript
{
  id: number;
  name: string;
  slug?: string;
  image?: string;
  images?: Array<{
    size: string;      // "150x150", "400x400", "800x800", "1200x1200", "original"
    url: string;       // URL de Cloudinary
    public_id: string; // ID público de Cloudinary (necesario para eliminar)
  }>;
}
```

---

## 🔗 Endpoints de Categorías

### 1. 📝 Crear Categoría

**POST** `/categories`

Crea una nueva categoría en el sistema.

#### Request Body

```json
{
  "name": "Smartphones",
  "slug": "smartphones",
  "image": "https://example.com/images/smartphones.jpg",
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/.../smartphones-150x150.jpg",
      "public_id": "ecommerce/smartphones-xyz789"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/.../smartphones-400x400.jpg",
      "public_id": "ecommerce/smartphones-xyz789"
    },
    {
      "size": "800x800",
      "url": "https://res.cloudinary.com/.../smartphones-800x800.jpg",
      "public_id": "ecommerce/smartphones-xyz789"
    },
    {
      "size": "1200x1200",
      "url": "https://res.cloudinary.com/.../smartphones-1200x1200.jpg",
      "public_id": "ecommerce/smartphones-xyz789"
    },
    {
      "size": "original",
      "url": "https://res.cloudinary.com/.../smartphones-original.jpg",
      "public_id": "ecommerce/smartphones-xyz789"
    }
  ]
}
```

#### Validaciones

- `name`: Requerido, string no vacío
- `slug`: Opcional, string
- `image`: Opcional, string (URL de imagen)
- `images`: Opcional, array de objetos con `size` (string), `url` (string, URL válida) y `public_id` (string, ID de Cloudinary)

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Smartphones",
    "slug": "smartphones",
    "image": "https://example.com/images/smartphones.jpg",
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../smartphones-150x150.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../smartphones-400x400.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "800x800",
        "url": "https://res.cloudinary.com/.../smartphones-800x800.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "1200x1200",
        "url": "https://res.cloudinary.com/.../smartphones-1200x1200.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "original",
        "url": "https://res.cloudinary.com/.../smartphones-original.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      }
    ]
  }
}
```

---

### 2. 📋 Listar Categorías (con Filtros y Paginación)

**GET** `/categories`

Obtiene una lista paginada de categorías con filtros y ordenamiento.

#### Query Parameters

| Parámetro   | Tipo   | Descripción                                         | Ejemplo          |
| ----------- | ------ | --------------------------------------------------- | ---------------- |
| `page`      | number | Número de página (por defecto: 1)                   | `?page=2`        |
| `limit`     | number | Elementos por página (por defecto: 20, máximo: 100) | `?limit=10`      |
| `sortBy`    | string | Campo de ordenamiento                               | `?sortBy=name`   |
| `sortOrder` | string | Orden (ASC/DESC)                                    | `?sortOrder=ASC` |

#### Campos de Ordenamiento Disponibles

- `id` (por defecto)
- `name`

#### Ejemplos de Uso

**Básico:**

```
GET /categories
```

**Con paginación:**

```
GET /categories?page=1&limit=10
```

**Con ordenamiento:**

```
GET /categories?sortBy=name&sortOrder=ASC
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones",
        "image": "https://example.com/images/smartphones.jpg",
        "images": [
          {
            "size": "150x150",
            "url": "https://res.cloudinary.com/.../smartphones-150x150.jpg",
            "public_id": "ecommerce/smartphones-xyz789"
          },
          {
            "size": "400x400",
            "url": "https://res.cloudinary.com/.../smartphones-400x400.jpg",
            "public_id": "ecommerce/smartphones-xyz789"
          }
        ]
      },
      {
        "id": 2,
        "name": "Laptops",
        "slug": "laptops",
        "image": "https://example.com/images/laptops.jpg",
        "images": [
          {
            "size": "150x150",
            "url": "https://res.cloudinary.com/.../laptops-150x150.jpg",
            "public_id": "ecommerce/laptops-def456"
          },
          {
            "size": "400x400",
            "url": "https://res.cloudinary.com/.../laptops-400x400.jpg",
            "public_id": "ecommerce/laptops-def456"
          }
        ]
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. 🔍 Obtener Categoría por ID

**GET** `/categories/{id}`

Obtiene una categoría específica por su ID.

#### Path Parameters

- `id`: ID de la categoría (número entero)

#### Ejemplo

```
GET /categories/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Smartphones",
    "slug": "smartphones",
    "image": "https://example.com/images/smartphones.jpg",
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../smartphones-150x150.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../smartphones-400x400.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "800x800",
        "url": "https://res.cloudinary.com/.../smartphones-800x800.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "1200x1200",
        "url": "https://res.cloudinary.com/.../smartphones-1200x1200.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "original",
        "url": "https://res.cloudinary.com/.../smartphones-original.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      }
    ]
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/categories/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Category with ID 999 not found"
  }
}
```

---

### 4. ✏️ Actualizar Categoría

**PATCH** `/categories/{id}`

Actualiza una categoría existente.

#### Path Parameters

- `id`: ID de la categoría (número entero)

#### Request Body

```json
{
  "name": "Smartphones y Tablets",
  "slug": "smartphones-tablets",
  "image": "https://example.com/images/mobile-devices.jpg",
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/.../mobile-devices-150x150.jpg",
      "public_id": "ecommerce/mobile-devices-ghi789"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/.../mobile-devices-400x400.jpg",
      "public_id": "ecommerce/mobile-devices-ghi789"
    }
  ]
}
```

> **Nota sobre imágenes:** Al igual que en productos, enviar un array en `images` **sobrescribirá** las imágenes anteriores de la categoría. Enviar `[]` **borrará** todas las imágenes. Omitir el campo mantendrá las actuales.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Smartphones y Tablets",
    "slug": "smartphones-tablets",
    "image": "https://example.com/images/mobile-devices.jpg",
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../mobile-devices-150x150.jpg",
        "public_id": "ecommerce/mobile-devices-ghi789"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../mobile-devices-400x400.jpg",
        "public_id": "ecommerce/mobile-devices-ghi789"
      }
    ]
  }
}
```

---

### 5. 🗑️ Eliminar Categoría

**DELETE** `/categories/{id}`

Elimina una categoría del sistema.

#### Path Parameters

- `id`: ID de la categoría (número entero)

#### Ejemplo

```
DELETE /categories/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/categories/999",
  "method": "DELETE",
  "statusCode": 404,
  "error": {
    "message": "Category with ID 999 not found"
  }
}
```

---

## 🏢 Módulo de Marcas

### 🏗️ Estructura de Datos

#### Marca (Brand)

```typescript
{
  id: number;
  name: string;
}
```

---

## 🔗 Endpoints de Marcas

### 1. 📝 Crear Marca

**POST** `/brands`

Crea una nueva marca en el sistema.

#### Request Body

```json
{
  "name": "Apple"
}
```

#### Validaciones

- `name`: Requerido, string no vacío

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apple"
  }
}
```

---

### 2. 📋 Listar Marcas (con Filtros y Paginación)

**GET** `/brands`

Obtiene una lista paginada de marcas con filtros y ordenamiento.

#### Query Parameters

| Parámetro   | Tipo   | Descripción                                         | Ejemplo          |
| ----------- | ------ | --------------------------------------------------- | ---------------- |
| `page`      | number | Número de página (por defecto: 1)                   | `?page=2`        |
| `limit`     | number | Elementos por página (por defecto: 20, máximo: 100) | `?limit=10`      |
| `sortBy`    | string | Campo de ordenamiento                               | `?sortBy=name`   |
| `sortOrder` | string | Orden (ASC/DESC)                                    | `?sortOrder=ASC` |

#### Campos de Ordenamiento Disponibles

- `id` (por defecto)
- `name`

#### Ejemplos de Uso

**Básico:**

```
GET /brands
```

**Con paginación:**

```
GET /brands?page=1&limit=10
```

**Con ordenamiento:**

```
GET /brands?sortBy=name&sortOrder=ASC
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Apple"
      },
      {
        "id": 2,
        "name": "Samsung"
      },
      {
        "id": 3,
        "name": "Google"
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

### 3. 🔍 Obtener Marca por ID

**GET** `/brands/{id}`

Obtiene una marca específica por su ID.

#### Path Parameters

- `id`: ID de la marca (número entero)

#### Ejemplo

```
GET /brands/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apple"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/brands/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Brand with ID 999 not found"
  }
}
```

---

### 4. ✏️ Actualizar Marca

**PATCH** `/brands/{id}`

Actualiza una marca existente.

#### Path Parameters

- `id`: ID de la marca (número entero)

#### Request Body

```json
{
  "name": "Apple Inc."
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apple Inc."
  }
}
```

---

### 5. 🗑️ Eliminar Marca

**DELETE** `/brands/{id}`

Elimina una marca del sistema.

#### Path Parameters

- `id`: ID de la marca (número entero)

#### Ejemplo

```
DELETE /brands/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Brand deleted successfully"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/brands/999",
  "method": "DELETE",
  "statusCode": 404,
  "error": {
    "message": "Brand with ID 999 not found"
  }
}
```

---

## 👥 Módulo de Usuarios

### 🏗️ Estructura de Datos

#### Usuario (Users)

```typescript
{
  id: number;
  email: string;
  password: string; // Encriptada con bcrypt
  full_name?: string;
  phone?: string;
}
```

**Nota:** Las contraseñas se encriptan automáticamente usando bcrypt y nunca se devuelven en las respuestas GET.

---

## 🔗 Endpoints de Usuarios

### 1. 📝 Crear Usuario

**POST** `/users`

Crea un nuevo usuario en el sistema con validaciones de seguridad.

#### Request Body

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "full_name": "Juan Pérez",
  "phone": "+1234567890"
}
```

#### Validaciones

- `email`: Requerido, formato de email válido, único en el sistema
- `password`: Requerido, mínimo 6 caracteres
- `full_name`: Opcional, string
- `phone`: Opcional, string

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "password": "$2b$10$NfgFGuNUxQwCwQt2r6l/3uMMfXkyHogJPjo3M68RtqcocL69qRGki",
    "full_name": "Juan Pérez",
    "phone": "+1234567890"
  }
}
```

#### Error Response (409 Conflict)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "statusCode": 409,
  "error": {
    "message": "El email ya está registrado"
  }
}
```

---

### 2. 📋 Listar Usuarios (con Filtros y Paginación)

**GET** `/users`

Obtiene una lista paginada de usuarios con filtros y ordenamiento.

#### Query Parameters

| Parámetro   | Tipo   | Descripción                                         | Ejemplo           |
| ----------- | ------ | --------------------------------------------------- | ----------------- |
| `page`      | number | Número de página (por defecto: 1)                   | `?page=2`         |
| `limit`     | number | Elementos por página (por defecto: 20, máximo: 100) | `?limit=10`       |
| `email`     | string | Filtrar por email (búsqueda parcial)                | `?email=test`     |
| `full_name` | string | Filtrar por nombre completo (búsqueda parcial)      | `?full_name=Juan` |
| `sortBy`    | string | Campo de ordenamiento                               | `?sortBy=email`   |
| `sortOrder` | string | Orden (ASC/DESC)                                    | `?sortOrder=ASC`  |

#### Campos de Ordenamiento Disponibles

- `id` (por defecto)
- `email`
- `full_name`
- `createdAt`
- `updatedAt`

#### Ejemplos de Uso

**Básico:**

```
GET /users
```

**Con filtros:**

```
GET /users?email=test&full_name=Juan
```

**Con paginación:**

```
GET /users?page=1&limit=10
```

**Completo:**

```
GET /users?page=1&limit=10&email=test&full_name=Juan&sortBy=email&sortOrder=ASC
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "email": "usuario@ejemplo.com",
        "full_name": "Juan Pérez",
        "phone": "+1234567890"
      },
      {
        "id": 2,
        "email": "maria@ejemplo.com",
        "full_name": "María García",
        "phone": "+0987654321"
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

### 3. 🔍 Obtener Usuario por ID

**GET** `/users/{id}`

Obtiene un usuario específico por su ID.

#### Path Parameters

- `id`: ID del usuario (número entero)

#### Ejemplo

```
GET /users/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "full_name": "Juan Pérez",
    "phone": "+1234567890"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Usuario con ID 999 no encontrado"
  }
}
```

---

### 4. ✏️ Actualizar Usuario

**PATCH** `/users/{id}`

Actualiza un usuario existente. Solo se actualizan los campos proporcionados.

#### Path Parameters

- `id`: ID del usuario (número entero)

#### Request Body

```json
{
  "full_name": "Juan Carlos Pérez",
  "phone": "+0987654321"
}
```

#### Validaciones

- `email`: Si se proporciona, debe ser único y válido
- `password`: Si se proporciona, será encriptado automáticamente
- `full_name`: Opcional, string
- `phone`: Opcional, string

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "full_name": "Juan Carlos Pérez",
    "phone": "+0987654321"
  }
}
```

---

### 5. 🗑️ Eliminar Usuario

**DELETE** `/users/{id}`

Elimina un usuario del sistema.

#### Path Parameters

- `id`: ID del usuario (número entero)

#### Ejemplo

```
DELETE /users/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Usuario con ID 1 eliminado exitosamente"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users/999",
  "method": "DELETE",
  "statusCode": 404,
  "error": {
    "message": "Usuario con ID 999 no encontrado"
  }
}
```

---

## 📋 Módulo de Estados de Orden

### 🏗️ Estructura de Datos

#### Estado de Orden (OrderStatus)

```typescript
{
  id: number;
  identifier: string; // Identificador único (ej: "pending", "shipped")
  name: string; // Nombre legible (ej: "Pendiente", "Enviado")
}
```

---

## 🔗 Endpoints de Estados de Orden

### 1. 📋 Listar Todos los Estados de Orden

**GET** `/order-status`

Obtiene todos los estados de orden disponibles.

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "identifier": "pending",
      "name": "Pendiente"
    },
    {
      "id": 2,
      "identifier": "processing",
      "name": "Procesando"
    },
    {
      "id": 3,
      "identifier": "shipped",
      "name": "Enviado"
    },
    {
      "id": 4,
      "identifier": "delivered",
      "name": "Entregado"
    },
    {
      "id": 5,
      "identifier": "cancelled",
      "name": "Cancelado"
    }
  ]
}
```

---

### 2. 🔍 Obtener Estado de Orden por ID

**GET** `/order-status/{id}`

Obtiene un estado de orden específico por su ID.

#### Path Parameters

- `id`: ID del estado de orden (número entero)

#### Ejemplo

```
GET /order-status/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "identifier": "pending",
    "name": "Pendiente"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/order-status/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Cannot GET /api/v1/order-status/999"
  }
}
```

---

## 💳 Módulo de Métodos de Pago

### 🏗️ Estructura de Datos

#### Método de Pago (PaymentMethods)

```typescript
{
  id: number;
  identifier: string; // Identificador único (ej: "credit_card", "paypal")
  name: string; // Nombre legible (ej: "Tarjeta de Crédito", "PayPal")
}
```

---

## 🔗 Endpoints de Métodos de Pago

### 1. 📋 Listar Todos los Métodos de Pago

**GET** `/payment-methods`

Obtiene todos los métodos de pago disponibles.

#### Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "identifier": "credit_card",
      "name": "Tarjeta de Crédito"
    },
    {
      "id": 2,
      "identifier": "debit_card",
      "name": "Tarjeta de Débito"
    },
    {
      "id": 3,
      "identifier": "paypal",
      "name": "PayPal"
    },
    {
      "id": 4,
      "identifier": "bank_transfer",
      "name": "Transferencia Bancaria"
    },
    {
      "id": 5,
      "identifier": "cash",
      "name": "Efectivo"
    },
    {
      "id": 6,
      "identifier": "mobile_money",
      "name": "Pago móvil"
    },
    {
      "id": 7,
      "identifier": "usdt",
      "name": "USDT"
    },
    {
      "id": 8,
      "identifier": "other",
      "name": "Otro"
    }
  ]
}
```

---

### 2. 🔍 Obtener Método de Pago por ID

**GET** `/payment-methods/{id}`

Obtiene un método de pago específico por su ID.

#### Path Parameters

- `id`: ID del método de pago (número entero)

#### Ejemplo

```
GET /payment-methods/1
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "identifier": "credit_card",
    "name": "Tarjeta de Crédito"
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/payment-methods/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Cannot GET /api/v1/payment-methods/999"
  }
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción                                 |
| ------ | ------------------------------------------- |
| `200`  | OK - Solicitud exitosa                      |
| `201`  | Created - Recurso creado exitosamente       |
| `204`  | No Content - Recurso eliminado exitosamente |
| `400`  | Bad Request - Datos de entrada inválidos    |
| `404`  | Not Found - Recurso no encontrado           |
| `409`  | Conflict - Conflicto (ej: email duplicado)  |
| `500`  | Internal Server Error - Error del servidor  |

---

## 🔧 Ejemplos de Uso con cURL

### Productos

#### Crear Producto

```bash
curl -X POST http://localhost:4000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "El último smartphone de Apple",
    "price": 999.99,
    "categoryId": 1,
    "brandId": 1
  }'
```

#### Listar Productos con Filtros

```bash
curl -X GET "http://localhost:4000/api/v1/products?page=1&limit=5&categoryId=1&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=ASC"
```

#### Actualizar Producto

```bash
curl -X PUT http://localhost:4000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "price": 1099.99,
    "stock": 50
  }'
```

#### Actualizar Stock

```bash
curl -X PATCH http://localhost:4000/api/v1/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock": 75}'
```

### Categorías

#### Crear Categoría

```bash
curl -X POST http://localhost:4000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphones",
    "slug": "smartphones",
    "image": "https://example.com/images/smartphones.jpg",
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/.../smartphones-150x150.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/.../smartphones-400x400.jpg",
        "public_id": "ecommerce/smartphones-xyz789"
      }
    ]
  }'
```

#### Listar Categorías

```bash
curl -X GET "http://localhost:4000/api/v1/categories?page=1&limit=10&sortBy=name&sortOrder=ASC"
```

#### Obtener Categoría por ID

```bash
curl -X GET http://localhost:4000/api/v1/categories/1
```

#### Actualizar Categoría

```bash
curl -X PATCH http://localhost:4000/api/v1/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphones y Tablets",
    "slug": "smartphones-tablets"
  }'
```

#### Eliminar Categoría

```bash
curl -X DELETE http://localhost:4000/api/v1/categories/1
```

### Marcas

#### Crear Marca

```bash
curl -X POST http://localhost:4000/api/v1/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple"
  }'
```

#### Listar Marcas

```bash
curl -X GET "http://localhost:4000/api/v1/brands?page=1&limit=10&sortBy=name&sortOrder=ASC"
```

#### Obtener Marca por ID

```bash
curl -X GET http://localhost:4000/api/v1/brands/1
```

#### Actualizar Marca

```bash
curl -X PATCH http://localhost:4000/api/v1/brands/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Inc."
  }'
```

#### Eliminar Marca

```bash
curl -X DELETE http://localhost:4000/api/v1/brands/1
```

### Usuarios

#### Crear Usuario

```bash
curl -X POST http://localhost:4000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123",
    "full_name": "Juan Pérez",
    "phone": "+1234567890"
  }'
```

#### Listar Usuarios con Filtros

```bash
curl -X GET "http://localhost:4000/api/v1/users?page=1&limit=10&email=test&sortBy=email&sortOrder=ASC"
```

#### Obtener Usuario por ID

```bash
curl -X GET http://localhost:4000/api/v1/users/1
```

#### Actualizar Usuario

```bash
curl -X PATCH http://localhost:4000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Juan Carlos Pérez",
    "phone": "+0987654321"
  }'
```

#### Eliminar Usuario

```bash
curl -X DELETE http://localhost:4000/api/v1/users/1
```

### Estados de Orden

#### Listar Estados de Orden

```bash
curl -X GET http://localhost:4000/api/v1/order-status
```

#### Obtener Estado de Orden por ID

```bash
curl -X GET http://localhost:4000/api/v1/order-status/1
```

### Métodos de Pago

#### Listar Métodos de Pago

```bash
curl -X GET http://localhost:4000/api/v1/payment-methods
```

#### Obtener Método de Pago por ID

```bash
curl -X GET http://localhost:4000/api/v1/payment-methods/1
```

---

## 🛡️ Manejo de Errores

### Estructura de Error

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products",
  "method": "POST",
  "statusCode": 400,
  "error": {
    "message": "Validation failed",
    "errors": [
      {
        "field": "name",
        "message": "name should not be empty"
      }
    ]
  }
}
```

### Errores Comunes

1. **Validación de Datos (400)**
   - Campos requeridos faltantes
   - Tipos de datos incorrectos
   - Valores fuera de rango
   - Email inválido
   - Contraseña muy corta (mínimo 6 caracteres)

2. **Recurso No Encontrado (404)**
   - Producto inexistente
   - Categoría inexistente
   - Marca inexistente
   - Usuario inexistente
   - Estado de orden inexistente
   - Método de pago inexistente

3. **Conflicto (409)**
   - Email ya registrado
   - Nombre de categoría duplicado
   - Nombre de marca duplicado

4. **Error del Servidor (500)**
   - Problemas de base de datos
   - Errores internos

---

## 🚀 Casos de Uso Comunes

### 1. E-commerce Frontend

```javascript
// Obtener productos para catálogo
const response = await fetch("/api/v1/products?page=1&limit=20&inStock=true");
const products = await response.json();

// Filtrar por categoría
const smartphones = await fetch("/api/v1/products?categoryId=1&inStock=true");

// Buscar productos por rango de precio
const affordable = await fetch("/api/v1/products?minPrice=100&maxPrice=500");

// Obtener categorías para navegación
const categories = await fetch("/api/v1/categories");
const categoriesData = await categories.json();

// Obtener marcas para filtros
const brands = await fetch("/api/v1/brands");
const brandsData = await brands.json();
```

### 2. Panel de Administración

```javascript
// Crear nuevo producto
const newProduct = await fetch("/api/v1/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(productData),
});

// Actualizar stock
const updateStock = await fetch(`/api/v1/products/${id}/stock`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ stock: newStock }),
});

// Crear nueva categoría
const newCategory = await fetch("/api/v1/categories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nueva Categoría",
    slug: "nueva-categoria",
    image: "https://example.com/image.jpg",
    images: [
      {
        size: "150x150",
        url: "https://res.cloudinary.com/.../categoria-150x150.jpg",
        public_id: "ecommerce/categoria-abc123",
      },
      {
        size: "400x400",
        url: "https://res.cloudinary.com/.../categoria-400x400.jpg",
        public_id: "ecommerce/categoria-abc123",
      },
    ],
  }),
});

// Crear nueva marca
const newBrand = await fetch("/api/v1/brands", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nueva Marca",
  }),
});
```

### 3. Aplicación Móvil

```javascript
// Cargar productos con paginación
const loadProducts = async (page = 1) => {
  const response = await fetch(`/api/v1/products?page=${page}&limit=10`);
  return response.json();
};

// Filtrar por marca
const loadByBrand = async (brandId) => {
  const response = await fetch(`/api/v1/products/brand/${brandId}`);
  return response.json();
};

// Cargar categorías para menú
const loadCategories = async () => {
  const response = await fetch("/api/v1/categories?sortBy=name&sortOrder=ASC");
  return response.json();
};

// Cargar marcas para filtros
const loadBrands = async () => {
  const response = await fetch("/api/v1/brands?sortBy=name&sortOrder=ASC");
  return response.json();
};

// Gestión de usuarios
const createUser = async (userData) => {
  const response = await fetch("/api/v1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Cargar estados de orden para formularios
const loadOrderStatuses = async () => {
  const response = await fetch("/api/v1/order-status");
  return response.json();
};

// Cargar métodos de pago para formularios
const loadPaymentMethods = async () => {
  const response = await fetch("/api/v1/payment-methods");
  return response.json();
};
```

---

## 📈 Consideraciones de Rendimiento

### Paginación

- Usa siempre paginación para listas grandes
- Limite máximo: 100 elementos por página
- Por defecto: 20 elementos por página

### Filtros

- Combina filtros para reducir resultados
- Usa `inStock=true` para mostrar solo productos disponibles
- Aplica ordenamiento para mejorar UX

### Caché

- Considera implementar caché en el frontend
- Los productos no cambian frecuentemente
- Usa timestamps para invalidación

---

## 🔄 Próximas Funcionalidades

- [ ] Búsqueda por texto (nombre, descripción)
- [ ] Filtros por rating
- [ ] Ordenamiento por popularidad
- [x] Endpoints para categorías y marcas ✅
- [x] Endpoints para usuarios con CRUD completo ✅
- [x] Endpoints para estados de orden ✅
- [x] Endpoints para métodos de pago ✅
- [ ] Autenticación y autorización (JWT)
- [ ] Rate limiting
- [ ] Webhooks para eventos
- [x] Upload de imágenes para categorías y productos ✅
- [ ] Soft delete para todos los módulos
- [ ] Endpoints para estadísticas y reportes
- [ ] Sistema de roles y permisos
- [ ] Endpoints para gestión de órdenes
- [ ] Sistema de notificaciones

---

## 📞 Soporte

Para dudas o problemas con la API:

1. Revisa esta documentación
2. Consulta la documentación Swagger en `/api/v1/docs`
3. Verifica los logs del servidor
4. Contacta al equipo de desarrollo

---

## 📋 Resumen de Endpoints

### Productos

| Método | Endpoint                  | Descripción                                 |
| ------ | ------------------------- | ------------------------------------------- |
| POST   | `/products`               | Crear producto                              |
| GET    | `/products`               | Listar productos (con filtros y paginación) |
| GET    | `/products/in-stock`      | Obtener productos en stock                  |
| GET    | `/products/category/{id}` | Obtener productos por categoría             |
| GET    | `/products/brand/{id}`    | Obtener productos por marca                 |
| GET    | `/products/{id}`          | Obtener producto por ID                     |
| PUT    | `/products/{id}`          | Actualizar producto                         |
| PATCH  | `/products/{id}/stock`    | Actualizar stock                            |
| DELETE | `/products/{id}`          | Eliminar producto                           |

### Categorías

| Método | Endpoint           | Descripción                                  |
| ------ | ------------------ | -------------------------------------------- |
| POST   | `/categories`      | Crear categoría                              |
| GET    | `/categories`      | Listar categorías (con filtros y paginación) |
| GET    | `/categories/{id}` | Obtener categoría por ID                     |
| PATCH  | `/categories/{id}` | Actualizar categoría                         |
| DELETE | `/categories/{id}` | Eliminar categoría                           |

### Marcas

| Método | Endpoint       | Descripción                              |
| ------ | -------------- | ---------------------------------------- |
| POST   | `/brands`      | Crear marca                              |
| GET    | `/brands`      | Listar marcas (con filtros y paginación) |
| GET    | `/brands/{id}` | Obtener marca por ID                     |
| PATCH  | `/brands/{id}` | Actualizar marca                         |
| DELETE | `/brands/{id}` | Eliminar marca                           |

### Usuarios

| Método | Endpoint      | Descripción                                |
| ------ | ------------- | ------------------------------------------ |
| POST   | `/users`      | Crear usuario                              |
| GET    | `/users`      | Listar usuarios (con filtros y paginación) |
| GET    | `/users/{id}` | Obtener usuario por ID                     |
| PATCH  | `/users/{id}` | Actualizar usuario                         |
| DELETE | `/users/{id}` | Eliminar usuario                           |

### Estados de Orden

| Método | Endpoint             | Descripción                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/order-status`      | Listar estados de orden        |
| GET    | `/order-status/{id}` | Obtener estado de orden por ID |

### Métodos de Pago

| Método | Endpoint                | Descripción                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/payment-methods`      | Listar métodos de pago        |
| GET    | `/payment-methods/{id}` | Obtener método de pago por ID |

---

## 🛒 Módulo de Órdenes

El módulo de órdenes proporciona funcionalidad completa para la gestión de pedidos de e-commerce, incluyendo la creación de órdenes con múltiples productos, gestión de estados, métodos de pago y relaciones completas entre entidades.

### Características Principales

- ✅ **CRUD completo** para órdenes
- ✅ **Gestión de productos asociados** (tabla `order_products`)
- ✅ **Transacciones de base de datos** para integridad de datos
- ✅ **Relaciones bidireccionales** con usuarios, estados, métodos de pago y productos
- ✅ **Filtros avanzados** por usuario, estado, método de pago, total, fecha y dirección
- ✅ **Paginación y ordenamiento** configurable
- ✅ **Validaciones robustas** con DTOs
- ✅ **Manejo de errores** especializado

### Estructura de Datos

#### Orden (Order)

```json
{
  "id": 1,
  "user_id": 2,
  "status_id": 1,
  "total": 299.97,
  "date": "2025-10-08T21:19:38.965Z",
  "payment_method_id": 1,
  "address": "Calle 456, Ciudad, País"
}
```

#### Producto de Orden (OrderProduct)

```json
{
  "id": 1,
  "product_id": 1,
  "order_id": 1,
  "quantity": 2,
  "price": 99.99,
  "sub_total": 199.98
}
```

### Endpoints Disponibles

| Método | Endpoint                | Descripción                             |
| ------ | ----------------------- | --------------------------------------- |
| GET    | `/orders`               | Listar órdenes con filtros y paginación |
| GET    | `/orders/{id}`          | Obtener orden específica con relaciones |
| GET    | `/orders/user/{userId}` | Obtener órdenes por usuario             |
| POST   | `/orders`               | Crear nueva orden con productos         |
| PATCH  | `/orders/{id}`          | Actualizar orden existente              |
| DELETE | `/orders/{id}`          | Eliminar orden                          |

---

### 📋 GET /orders

Lista todas las órdenes con filtros opcionales, paginación y relaciones completas.

#### Parámetros de Consulta

| Parámetro           | Tipo   | Requerido | Descripción                                  |
| ------------------- | ------ | --------- | -------------------------------------------- |
| `page`              | number | No        | Número de página (default: 1)                |
| `limit`             | number | No        | Elementos por página (default: 20, max: 100) |
| `user_id`           | number | No        | Filtrar por ID de usuario                    |
| `status_id`         | number | No        | Filtrar por ID de estado                     |
| `payment_method_id` | number | No        | Filtrar por ID de método de pago             |
| `minTotal`          | number | No        | Filtrar por total mínimo                     |
| `maxTotal`          | number | No        | Filtrar por total máximo                     |
| `address`           | string | No        | Filtrar por dirección (búsqueda parcial)     |
| `dateFrom`          | string | No        | Filtrar desde fecha (YYYY-MM-DD)             |
| `dateTo`            | string | No        | Filtrar hasta fecha (YYYY-MM-DD)             |
| `sortBy`            | string | No        | Campo para ordenar (default: date)           |
| `sortOrder`         | string | No        | Orden ASC/DESC (default: DESC)               |

#### Campos de Ordenamiento Disponibles

- `id` - ID de la orden
- `total` - Total de la orden
- `date` - Fecha de la orden
- `user_id` - ID del usuario
- `status_id` - ID del estado

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 24,
        "user_id": 2,
        "status_id": 1,
        "total": 299.97,
        "date": "2025-10-08T21:19:38.965Z",
        "payment_method_id": 1,
        "address": "Calle 456, Ciudad, País",
        "user": {
          "id": 2,
          "email": "test2@ejemplo.com",
          "full_name": "Segundo Usuario",
          "phone": null
        },
        "status": {
          "id": 1,
          "identifier": "pending",
          "name": "Pendiente"
        },
        "paymentMethod": {
          "id": 1,
          "identifier": "credit_card",
          "name": "Tarjeta de Crédito"
        },
        "products": [
          {
            "id": 4,
            "product_id": 1,
            "order_id": 24,
            "quantity": 2,
            "price": "99.99",
            "sub_total": "199.98",
            "product": {
              "id": 1,
              "name": "Elegant Diamond Solitaire Ring",
              "sku": "RING-001",
              "price": 1299.99
            }
          }
        ]
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### Ejemplos de Uso

```bash
# Listar todas las órdenes
GET /api/v1/orders

# Filtrar por usuario
GET /api/v1/orders?user_id=2

# Filtrar por estado y ordenar por fecha
GET /api/v1/orders?status_id=1&sortBy=date&sortOrder=DESC

# Filtrar por rango de totales
GET /api/v1/orders?minTotal=100&maxTotal=500

# Filtrar por rango de fechas
GET /api/v1/orders?dateFrom=2025-10-01&dateTo=2025-10-31

# Paginación
GET /api/v1/orders?page=2&limit=10
```

---

### 🔍 GET /orders/{id}

Obtiene una orden específica por su ID, incluyendo todas las relaciones.

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción    |
| --------- | ------ | --------- | -------------- |
| `id`      | number | Sí        | ID de la orden |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": 24,
    "user_id": 2,
    "status_id": 1,
    "total": 299.97,
    "date": "2025-10-08T21:19:38.965Z",
    "payment_method_id": 1,
    "address": "Calle 456, Ciudad, País",
    "user": {
      "id": 2,
      "email": "test2@ejemplo.com",
      "full_name": "Segundo Usuario",
      "phone": null
    },
    "status": {
      "id": 1,
      "identifier": "pending",
      "name": "Pendiente"
    },
    "paymentMethod": {
      "id": 1,
      "identifier": "credit_card",
      "name": "Tarjeta de Crédito"
    },
    "products": [
      {
        "id": 4,
        "product_id": 1,
        "order_id": 24,
        "quantity": 2,
        "price": "99.99",
        "sub_total": "199.98",
        "product": {
          "id": 1,
          "name": "Elegant Diamond Solitaire Ring",
          "sku": "RING-001",
          "price": 1299.99
        }
      },
      {
        "id": 5,
        "product_id": 2,
        "order_id": 24,
        "quantity": 1,
        "price": "99.99",
        "sub_total": "99.99",
        "product": {
          "id": 2,
          "name": "Pearl Drop Earrings 1",
          "sku": "EAR-002",
          "price": 89.99
        }
      }
    ]
  }
}
```

#### Respuesta de Error (404)

```json
{
  "success": false,
  "timestamp": "2025-10-08T21:19:38.965Z",
  "path": "/api/v1/orders/999",
  "method": "GET",
  "statusCode": 404,
  "error": {
    "message": "Orden con ID 999 no encontrada"
  }
}
```

---

### 👤 GET /orders/user/{userId}

Obtiene todas las órdenes de un usuario específico con relaciones completas.

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción    |
| --------- | ------ | --------- | -------------- |
| `userId`  | number | Sí        | ID del usuario |

#### Parámetros de Consulta

Los mismos parámetros de paginación y filtrado que `/orders`, excepto `user_id` que se toma del parámetro de ruta.

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 24,
        "user_id": 2,
        "status_id": 1,
        "total": 299.97,
        "date": "2025-10-08T21:19:38.965Z",
        "payment_method_id": 1,
        "address": "Calle 456, Ciudad, País",
        "user": {
          "id": 2,
          "email": "test2@ejemplo.com",
          "full_name": "Segundo Usuario",
          "phone": null
        },
        "status": {
          "id": 1,
          "identifier": "pending",
          "name": "Pendiente"
        },
        "paymentMethod": {
          "id": 1,
          "identifier": "credit_card",
          "name": "Tarjeta de Crédito"
        },
        "products": [...]
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### Ejemplos de Uso

```bash
# Obtener órdenes del usuario 2
GET /api/v1/orders/user/2

# Obtener órdenes del usuario 2 con paginación
GET /api/v1/orders/user/2?page=1&limit=10

# Obtener órdenes del usuario 2 filtradas por estado
GET /api/v1/orders/user/2?status_id=1
```

---

### 🛒 POST /orders

Crea una nueva orden con productos asociados. Utiliza transacciones de base de datos para garantizar la integridad de los datos.

#### Cuerpo de la Petición

```json
{
  "user_id": 2,
  "status_id": 1,
  "total": 299.97,
  "payment_method_id": 1,
  "address": "Calle 456, Ciudad, País",
  "products": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 99.99
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 99.99
    }
  ]
}
```

#### Validaciones

| Campo               | Tipo   | Requerido | Validaciones                  |
| ------------------- | ------ | --------- | ----------------------------- |
| `user_id`           | number | Sí        | Debe ser un número positivo   |
| `status_id`         | number | Sí        | Debe ser un número positivo   |
| `total`             | number | Sí        | Debe ser un número positivo   |
| `payment_method_id` | number | Sí        | Debe ser un número positivo   |
| `address`           | string | No        | Cadena de texto opcional      |
| `products`          | array  | Sí        | Array con al menos 1 producto |

#### Validaciones de Productos

| Campo        | Tipo   | Requerido | Validaciones                |
| ------------ | ------ | --------- | --------------------------- |
| `product_id` | number | Sí        | Debe ser un número positivo |
| `quantity`   | number | Sí        | Debe ser al menos 1         |
| `price`      | number | Sí        | Debe ser un número positivo |

#### Validación de Total

El sistema valida automáticamente que el total proporcionado coincida con la suma de los productos:

- `total` debe ser igual a `sum(product.price * product.quantity)`

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "data": {
    "id": 24,
    "user_id": 2,
    "status_id": 1,
    "total": 299.97,
    "date": "2025-10-08T21:19:38.965Z",
    "payment_method_id": 1,
    "address": "Calle 456, Ciudad, País",
    "user": {
      "id": 2,
      "email": "test2@ejemplo.com",
      "full_name": "Segundo Usuario",
      "phone": null
    },
    "status": {
      "id": 1,
      "identifier": "pending",
      "name": "Pendiente"
    },
    "paymentMethod": {
      "id": 1,
      "identifier": "credit_card",
      "name": "Tarjeta de Crédito"
    },
    "products": [
      {
        "id": 4,
        "product_id": 1,
        "order_id": 24,
        "quantity": 2,
        "price": "99.99",
        "sub_total": "199.98",
        "product": {
          "id": 1,
          "name": "Elegant Diamond Solitaire Ring",
          "sku": "RING-001",
          "price": 1299.99
        }
      },
      {
        "id": 5,
        "product_id": 2,
        "order_id": 24,
        "quantity": 1,
        "price": "99.99",
        "sub_total": "99.99",
        "product": {
          "id": 2,
          "name": "Pearl Drop Earrings 1",
          "sku": "EAR-002",
          "price": 89.99
        }
      }
    ]
  }
}
```

#### Respuestas de Error

**400 - Datos Inválidos**

```json
{
  "success": false,
  "timestamp": "2025-10-08T21:19:38.965Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "statusCode": 400,
  "error": {
    "message": "El total calculado (199.98) no coincide con el total proporcionado (299.97)"
  }
}
```

**404 - Recurso No Encontrado**

```json
{
  "success": false,
  "timestamp": "2025-10-08T21:19:38.965Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "statusCode": 404,
  "error": {
    "message": "Usuario con ID 999 no encontrado"
  }
}
```

---

### ✏️ PATCH /orders/{id}

Actualiza una orden existente. Permite actualizaciones parciales de todos los campos, incluyendo productos.

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción    |
| --------- | ------ | --------- | -------------- |
| `id`      | number | Sí        | ID de la orden |

#### Cuerpo de la Petición

Todos los campos son opcionales. Si se incluyen productos, se reemplazan completamente.

```json
{
  "status_id": 2,
  "address": "Nueva dirección de entrega",
  "products": [
    {
      "product_id": 3,
      "quantity": 1,
      "price": 149.99
    }
  ]
}
```

#### Respuesta Exitosa (200)

Devuelve la orden actualizada con todas las relaciones.

```json
{
  "success": true,
  "data": {
    "id": 24,
    "user_id": 2,
    "status_id": 2,
    "total": 149.99,
    "date": "2025-10-08T21:19:38.965Z",
    "payment_method_id": 1,
    "address": "Nueva dirección de entrega",
    "user": {
      "id": 2,
      "email": "test2@ejemplo.com",
      "full_name": "Segundo Usuario",
      "phone": null
    },
    "status": {
      "id": 2,
      "identifier": "confirmed",
      "name": "Confirmada"
    },
    "paymentMethod": {
      "id": 1,
      "identifier": "credit_card",
      "name": "Tarjeta de Crédito"
    },
    "products": [
      {
        "id": 6,
        "product_id": 3,
        "order_id": 24,
        "quantity": 1,
        "price": "149.99",
        "sub_total": "149.99",
        "product": {
          "id": 3,
          "name": "Gold Chain Necklace",
          "sku": "NECK-003",
          "price": 149.99
        }
      }
    ]
  }
}
```

#### Respuesta de Error (404)

```json
{
  "success": false,
  "timestamp": "2025-10-08T21:19:38.965Z",
  "path": "/api/v1/orders/999",
  "method": "PATCH",
  "statusCode": 404,
  "error": {
    "message": "Orden con ID 999 no encontrada"
  }
}
```

---

### 🗑️ DELETE /orders/{id}

Elimina una orden y todos sus productos asociados. Utiliza transacciones para garantizar la integridad.

#### Parámetros de Ruta

| Parámetro | Tipo   | Requerido | Descripción    |
| --------- | ------ | --------- | -------------- |
| `id`      | number | Sí        | ID de la orden |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "message": "Orden eliminada exitosamente",
    "deletedOrderId": 24
  }
}
```

#### Respuesta de Error (404)

```json
{
  "success": false,
  "timestamp": "2025-10-08T21:19:38.965Z",
  "path": "/api/v1/orders/999",
  "method": "DELETE",
  "statusCode": 404,
  "error": {
    "message": "Orden con ID 999 no encontrada"
  }
}
```

---

### 🔗 Relaciones de Datos

El módulo de órdenes mantiene las siguientes relaciones:

#### Order → User (BelongsTo)

- **Campo**: `user_id`
- **Alias**: `user`
- **Campos incluidos**: `id`, `email`, `full_name`, `phone`

#### Order → OrderStatus (BelongsTo)

- **Campo**: `status_id`
- **Alias**: `status`
- **Campos incluidos**: `id`, `identifier`, `name`

#### Order → PaymentMethod (BelongsTo)

- **Campo**: `payment_method_id`
- **Alias**: `paymentMethod`
- **Campos incluidos**: `id`, `identifier`, `name`

#### Order → OrderProducts (HasMany)

- **Campo**: `id` → `order_id`
- **Alias**: `products`
- **Campos incluidos**: `id`, `product_id`, `order_id`, `quantity`, `price`, `sub_total`

#### OrderProduct → Product (BelongsTo)

- **Campo**: `product_id`
- **Alias**: `product`
- **Campos incluidos**: `id`, `name`, `sku`, `price`

---

### 🛠️ Funcionalidades Técnicas

#### Transacciones de Base de Datos

- **Creación**: Transacción completa para orden + productos
- **Actualización**: Transacción para cambios en orden y productos
- **Eliminación**: Transacción para eliminar orden y productos asociados
- **Rollback automático** en caso de errores

#### Validaciones de Negocio

- **Validación de total**: El total debe coincidir con la suma de productos
- **Validación de existencia**: Usuario, estado y método de pago deben existir
- **Validación de productos**: Al menos un producto requerido
- **Validación de cantidades**: Cantidades deben ser positivas

#### Manejo de Errores

- **400**: Datos inválidos o validaciones fallidas
- **404**: Recurso no encontrado
- **500**: Errores de servidor con rollback automático

---

## 📸 Módulo de Upload de Imágenes

El módulo de upload permite cargar imágenes a Cloudinary con optimización automática y generación de múltiples tamaños.

### Características Principales

- ✅ Upload de una o múltiples imágenes
- ✅ Optimización automática (calidad y formato)
- ✅ Generación de 4 tamaños: 150x150, 400x400, 800x800, 1200x1200
- ✅ Conversión automática a WebP cuando sea posible
- ✅ Imagen original preservada
- ✅ Eliminación de imágenes

### Endpoints Disponibles

| Método | Endpoint           | Descripción                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/upload/single`   | Sube una imagen                  |
| POST   | `/upload/multiple` | Sube múltiples imágenes (max 10) |
| DELETE | `/upload/single`   | Elimina una imagen               |
| DELETE | `/upload/multiple` | Elimina múltiples imágenes       |

### 📤 POST /upload/single

Sube una única imagen a Cloudinary y retorna URLs optimizadas.

#### Request

```bash
curl -X POST http://localhost:4000/api/v1/upload/single \
  -F "file=@image.jpg"
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "original": {
      "public_id": "ecommerce/abc123def456",
      "url": "http://res.cloudinary.com/.../ecommerce/abc123def456.jpg",
      "secureUrl": "https://res.cloudinary.com/.../ecommerce/abc123def456.jpg",
      "width": 2000,
      "height": 1500,
      "format": "jpg",
      "bytes": 345678
    },
    "sizes": {
      "small": {
        "width": 150,
        "height": 150,
        "url": "https://res.cloudinary.com/.../c_fill,f_auto,g_auto,h_150,q_auto,w_150/v1/ecommerce/abc123def456.jpg"
      },
      "medium": {
        "width": 400,
        "height": 400,
        "url": "https://res.cloudinary.com/.../c_fill,f_auto,g_auto,h_400,q_auto,w_400/v1/ecommerce/abc123def456.jpg"
      },
      "large": {
        "width": 800,
        "height": 800,
        "url": "https://res.cloudinary.com/.../c_fill,f_auto,g_auto,h_800,q_auto,w_800/v1/ecommerce/abc123def456.jpg"
      },
      "xlarge": {
        "width": 1200,
        "height": 1200,
        "url": "https://res.cloudinary.com/.../c_fill,f_auto,g_auto,h_1200,q_auto,w_1200/v1/ecommerce/abc123def456.jpg"
      }
    }
  }
}
```

### 📤 POST /upload/multiple

Sube múltiples imágenes (máximo 10).

#### Request

```bash
curl -X POST http://localhost:4000/api/v1/upload/multiple \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "files=@image3.jpg"
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": [
    {
      "original": {
        "public_id": "ecommerce/img1",
        "url": "http://...",
        "secureUrl": "https://...",
        "width": 2000,
        "height": 1500,
        "format": "jpg",
        "bytes": 345678
      },
      "sizes": {
        "small": { "width": 150, "height": 150, "url": "https://..." },
        "medium": { "width": 400, "height": 400, "url": "https://..." },
        "large": { "width": 800, "height": 800, "url": "https://..." },
        "xlarge": { "width": 1200, "height": 1200, "url": "https://..." }
      }
    },
    {
      "original": {
        "public_id": "ecommerce/img2",
        "url": "http://...",
        "secureUrl": "https://...",
        "width": 1800,
        "height": 1200,
        "format": "jpg",
        "bytes": 298765
      },
      "sizes": {
        "small": { "width": 150, "height": 150, "url": "https://..." },
        "medium": { "width": 400, "height": 400, "url": "https://..." },
        "large": { "width": 800, "height": 800, "url": "https://..." },
        "xlarge": { "width": 1200, "height": 1200, "url": "https://..." }
      }
    }
  ]
}
```

### 🗑️ DELETE /upload/single

Elimina una imagen de Cloudinary.

#### Request Body

```json
{
  "publicId": "ecommerce/abc123def456"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "result": "ok"
  }
}
```

### 🗑️ DELETE /upload/multiple

Elimina múltiples imágenes.

#### Request Body

```json
{
  "publicIds": ["ecommerce/img1", "ecommerce/img2", "ecommerce/img3"]
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "deleted": ["ecommerce/img1", "ecommerce/img2", "ecommerce/img3"]
  }
}
```

### 🔗 Integración con Productos y Categorías

Las imágenes subidas se pueden asociar a productos o categorías usando el formato:

```javascript
// 1. Subir imagen
const uploadResponse = await fetch("/api/v1/upload/single", {
  method: "POST",
  body: formData,
});
const { data: imageData } = await uploadResponse.json();

// 2. Formatear para producto/categoría
const images = [
  {
    size: "150x150",
    url: imageData.sizes.small.url,
    public_id: imageData.original.public_id,
  },
  {
    size: "400x400",
    url: imageData.sizes.medium.url,
    public_id: imageData.original.public_id,
  },
  {
    size: "800x800",
    url: imageData.sizes.large.url,
    public_id: imageData.original.public_id,
  },
  {
    size: "1200x1200",
    url: imageData.sizes.xlarge.url,
    public_id: imageData.original.public_id,
  },
  {
    size: "original",
    url: imageData.original.secureUrl,
    public_id: imageData.original.public_id,
  },
];

// 3. Crear producto/categoría con imágenes
await fetch("/api/v1/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Mi Producto",
    price: 99.99,
    categoryId: 1,
    brandId: 1,
    images: images,
  }),
});
```

### 📖 Documentación Completa

Para la documentación completa del módulo de upload, consulta:

- **UPLOAD_MODULE_DOCUMENTATION.md** - Documentación detallada con ejemplos
- **CATEGORIES_IMAGES_DOCUMENTATION.md** - Sistema de imágenes para categorías
- **test-upload.html** - Interfaz de prueba interactiva

---

## 📚 Documentación Adicional

- **API_DOCUMENTATION.md** - Este documento (documentación completa de la API)
- **UPLOAD_MODULE_DOCUMENTATION.md** - Documentación del módulo de upload
- **CORS_CONFIGURATION.md** - Configuración de CORS
- **PAGINATION_FILTERING_GUIDE.md** - Guía de paginación y filtrado
- **ENV_VARIABLES.md** - Variables de entorno necesarias
- **test-upload.html** - Interfaz de prueba para upload
- **Swagger UI** - http://localhost:4000/api/v1/docs

---

**Versión de la API:** 1.0  
**Última actualización:** Octubre 2024 (Sistema de imágenes integrado)  
**Framework:** NestJS + Sequelize + PostgreSQL + Cloudinary
