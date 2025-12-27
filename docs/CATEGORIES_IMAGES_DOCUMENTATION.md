# 📸 Sistema de Imágenes de Categorías

## 🚀 Introducción

El sistema de imágenes de categorías permite asociar múltiples tamaños de imagen a cada categoría, utilizando las URLs de Cloudinary ya cargadas. Este sistema está diseñado para ser eficiente y escalable.

## 🏗️ Arquitectura

### Tablas de Base de Datos

#### 1. `size_images`

Tabla que almacena los tamaños de imagen disponibles:

| Campo  | Tipo    | Descripción                                                       |
| ------ | ------- | ----------------------------------------------------------------- |
| `id`   | serial4 | ID único (PK)                                                     |
| `size` | string  | Tamaño de imagen (150x150, 400x400, 800x800, 1200x1200, original) |

#### 2. `categories_images`

Tabla que relaciona categorías con imágenes por tamaño:

| Campo         | Tipo    | Descripción                    |
| ------------- | ------- | ------------------------------ |
| `id`          | serial4 | ID único (PK)                  |
| `category_id` | int4    | ID de la categoría (FK)        |
| `size_id`     | int4    | ID del tamaño (FK)             |
| `url`         | text    | URL de la imagen en Cloudinary |

### Entidades

#### SizeImages Entity

```typescript
@Table({ tableName: "size_images", timestamps: false })
export class SizeImages extends Model<SizeImages, SizeImagesCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false, unique: true })
  size: string;
}
```

#### CategoriesImages Entity

```typescript
@Table({ tableName: "categories_images", timestamps: false })
export class CategoriesImages extends Model<
  CategoriesImages,
  CategoriesImagesCreationAttrs
> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Category)
  @Column({ allowNull: false })
  category_id: number;

  @ForeignKey(() => SizeImages)
  @Column({ allowNull: false })
  size_id: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  url: string;

  @BelongsTo(() => Category, { foreignKey: "category_id", as: "category" })
  category: Category;

  @BelongsTo(() => SizeImages, { foreignKey: "size_id", as: "size" })
  size: SizeImages;
}
```

## 📋 DTOs

### CategoryImageDto

```typescript
export class CategoryImageDto {
  @IsString()
  @IsNotEmpty()
  size: string; // "150x150", "400x400", "800x800", "1200x1200", "original"

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string; // URL de Cloudinary
}
```

### CreateCategoryDto (Actualizado)

```typescript
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryImageDto)
  images?: CategoryImageDto[];
}
```

## 🔧 Servicios

### SizeImagesService

Gestiona los tamaños de imagen disponibles:

```typescript
@Injectable()
export class SizeImagesService {
  // Obtener todos los tamaños
  async findAll(): Promise<SizeImages[]>;

  // Obtener un tamaño por ID
  async findOne(id: number): Promise<SizeImages | null>;

  // Obtener un tamaño por valor (ej: "150x150")
  async findBySize(size: string): Promise<SizeImages | null>;

  // Crear un nuevo tamaño
  async create(size: string): Promise<SizeImages>;

  // Inicializar tamaños por defecto
  async initializeDefaultSizes(): Promise<void>;
}
```

### CategoriesImagesService

Gestiona las imágenes de las categorías:

```typescript
@Injectable()
export class CategoriesImagesService {
  // Obtener todas las imágenes de una categoría
  async findByCategoryId(categoryId: number): Promise<CategoriesImages[]>;

  // Obtener una imagen específica por categoría y tamaño
  async findByCategoryAndSize(
    categoryId: number,
    sizeId: number,
  ): Promise<CategoriesImages | null>;

  // Crear o actualizar las imágenes de una categoría
  async createOrUpdateCategoryImages(
    categoryId: number,
    imagesDto: CreateCategoryImagesDto,
  ): Promise<CategoriesImages[]>;

  // Eliminar todas las imágenes de una categoría
  async deleteByCategoryId(categoryId: number): Promise<{ message: string }>;

  // Eliminar una imagen específica
  async deleteCategoryImage(
    categoryId: number,
    sizeId: number,
  ): Promise<{ message: string }>;

  // Formatear imágenes para respuesta de API
  formatImagesForResponse(categoryImages: CategoriesImages[]): any[];
}
```

## 🔗 Endpoints Actualizados

### Crear Categoría con Imágenes

**POST** `/api/v1/categories`

```json
{
  "name": "Electrónicos",
  "slug": "electronicos",
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_150,q_auto,w_150/v1/ecommerce/electronicos-150x150.jpg"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_400,q_auto,w_400/v1/ecommerce/electronicos-400x400.jpg"
    },
    {
      "size": "800x800",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_800,q_auto,w_800/v1/ecommerce/electronicos-800x800.jpg"
    },
    {
      "size": "1200x1200",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_1200,q_auto,w_1200/v1/ecommerce/electronicos-1200x1200.jpg"
    },
    {
      "size": "original",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-original.jpg"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electrónicos",
    "slug": "electronicos",
    "image": null,
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-150x150.jpg"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-400x400.jpg"
      },
      {
        "size": "800x800",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-800x800.jpg"
      },
      {
        "size": "1200x1200",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-1200x1200.jpg"
      },
      {
        "size": "original",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-original.jpg"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Obtener Categorías con Imágenes

**GET** `/api/v1/categories`

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Electrónicos",
        "slug": "electronicos",
        "image": null,
        "images": [
          {
            "size": "150x150",
            "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-150x150.jpg"
          },
          {
            "size": "400x400",
            "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-400x400.jpg"
          }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Obtener Categoría Individual con Imágenes

**GET** `/api/v1/categories/1`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electrónicos",
    "slug": "electronicos",
    "image": null,
    "images": [
      {
        "size": "150x150",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-150x150.jpg"
      },
      {
        "size": "400x400",
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-400x400.jpg"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Actualizar Categoría con Imágenes

**PUT** `/api/v1/categories/1`

```json
{
  "name": "Electrónicos Actualizados",
  "images": [
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-new-150x150.jpg"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/electronicos-new-400x400.jpg"
    }
  ]
}
```

### Eliminar Categoría (elimina también las imágenes)

**DELETE** `/api/v1/categories/1`

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Categoría con ID 1 eliminada exitosamente"
  }
}
```

## 🚀 Inicialización

### Script de Inicialización de Tamaños

Para inicializar los tamaños de imagen por defecto, ejecuta:

```bash
# Desde la raíz del proyecto
npx ts-node src/scripts/init-sizes.ts
```

O desde el código:

```typescript
import { initializeDefaultSizes } from "./src/scripts/init-sizes";

await initializeDefaultSizes();
```

### Tamaños por Defecto

El sistema inicializa automáticamente los siguientes tamaños:

1. `150x150` - Thumbnails, avatares pequeños
2. `400x400` - Grid de productos, previews
3. `800x800` - Vista individual de producto
4. `1200x1200` - Galería, zoom
5. `original` - Imagen original sin modificar

## 💻 Ejemplos de Uso

### Frontend - React

```jsx
import React, { useState } from "react";

function CategoryForm() {
  const [images, setImages] = useState([]);

  const handleImageUpload = async (files) => {
    // Subir imágenes a Cloudinary usando el módulo de upload
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      "http://localhost:4000/api/v1/upload/multiple",
      {
        method: "POST",
        body: formData,
      },
    );

    const { data } = await response.json();

    // Formatear para el DTO de categoría
    const categoryImages = data.map((img) => ({
      size: "original", // o el tamaño correspondiente
      url: img.original.secureUrl,
    }));

    setImages(categoryImages);
  };

  const handleSubmit = async (formData) => {
    const response = await fetch("http://localhost:4000/api/v1/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        images: images,
      }),
    });

    const result = await response.json();
    console.log("Categoría creada:", result);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <input
        type="file"
        multiple
        onChange={(e) => handleImageUpload(e.target.files)}
      />
      <button type="submit">Crear Categoría</button>
    </form>
  );
}
```

### Frontend - JavaScript Vanilla

```javascript
// Crear categoría con imágenes
const createCategoryWithImages = async (categoryData, imageUrls) => {
  const images = imageUrls.map((url) => ({
    size: "original", // o el tamaño correspondiente
    url: url,
  }));

  const response = await fetch("http://localhost:4000/api/v1/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...categoryData,
      images: images,
    }),
  });

  const result = await response.json();
  return result;
};

// Usar
const categoryData = {
  name: "Ropa Deportiva",
  slug: "ropa-deportiva",
};

const imageUrls = [
  "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/ropa-deportiva-150x150.jpg",
  "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/ropa-deportiva-400x400.jpg",
];

createCategoryWithImages(categoryData, imageUrls).then((result) =>
  console.log("Categoría creada:", result),
);
```

## 🔄 Flujo de Trabajo Recomendado

### 1. Subir Imágenes a Cloudinary

```javascript
// Usar el módulo de upload para subir imágenes
const uploadResponse = await fetch("/api/v1/upload/single", {
  method: "POST",
  body: formData,
});

const { data } = await uploadResponse.json();
```

### 2. Crear Categoría con URLs de Cloudinary

```javascript
// Usar las URLs generadas por Cloudinary
const categoryImages = [
  {
    size: "150x150",
    url: data.sizes.small.url,
  },
  {
    size: "400x400",
    url: data.sizes.medium.url,
  },
  {
    size: "800x800",
    url: data.sizes.large.url,
  },
  {
    size: "1200x1200",
    url: data.sizes.xlarge.url,
  },
  {
    size: "original",
    url: data.original.secureUrl,
  },
];
```

### 3. Crear/Actualizar Categoría

```javascript
const categoryResponse = await fetch("/api/v1/categories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Mi Categoría",
    slug: "mi-categoria",
    images: categoryImages,
  }),
});
```

## 🎯 Beneficios

### ✅ Eficiencia

- Reutilización de URLs de Cloudinary
- Múltiples tamaños para diferentes contextos
- Optimización automática de carga

### ✅ Escalabilidad

- Fácil agregar nuevos tamaños
- Relaciones normalizadas en base de datos
- Soporte para imágenes opcionales

### ✅ Flexibilidad

- Imágenes opcionales en categorías
- Actualización granular de imágenes
- Eliminación automática en cascada

### ✅ Rendimiento

- Carga lazy de imágenes
- URLs optimizadas de Cloudinary
- Formato automático (WebP cuando sea posible)

## 🔧 Personalización

### Agregar Nuevos Tamaños

1. **Agregar a la base de datos:**

```sql
INSERT INTO size_images (size) VALUES ('200x200');
```

2. **O usar el servicio:**

```typescript
const sizeImagesService = app.get(SizeImagesService);
await sizeImagesService.create("200x200");
```

### Modificar Tamaños por Defecto

Edita `src/modules/upload/size-images.service.ts`:

```typescript
async initializeDefaultSizes(): Promise<void> {
  const defaultSizes = [
    "100x100",    // Nuevo tamaño
    "150x150",
    "400x400",
    "800x800",
    "1200x1200",
    "original"
  ];
  // ... resto del código
}
```

## 📚 Referencias

- [Módulo de Upload](./UPLOAD_MODULE_DOCUMENTATION.md) - Para subir imágenes a Cloudinary
- [API de Categorías](./API_DOCUMENTATION.md#-módulo-de-categorías) - Documentación general de categorías
- [Cloudinary Documentation](https://cloudinary.com/documentation) - Documentación de Cloudinary

---

**Sistema listo para usar! 🚀**

Desarrollado con ❤️ usando NestJS + Sequelize + Cloudinary
