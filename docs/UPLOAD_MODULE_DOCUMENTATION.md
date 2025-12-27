# 📸 Módulo de Upload de Imágenes - Cloudinary

## 🚀 Introducción

El módulo de Upload proporciona funcionalidad completa para la gestión de imágenes en la nube usando Cloudinary. Permite subir, optimizar, transformar y eliminar imágenes sin necesidad de almacenarlas en el servidor.

### Características Principales

- ✅ **Upload de una o múltiples imágenes**
- ✅ **Optimización automática** (calidad y formato)
- ✅ **Generación de múltiples tamaños** (150x150, 400x400, 800x800, 1200x1200)
- ✅ **Conversión automática a WebP** cuando sea posible
- ✅ **Imagen original preservada** en Cloudinary
- ✅ **Eliminación de imágenes** (individual y múltiple)
- ✅ **Validación de tipos de archivo**
- ✅ **Manejo de errores robusto**

---

## ⚙️ Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dyfvo7wal
CLOUDINARY_API_KEY=322959825232166
CLOUDINARY_API_SECRET=hLySmMhfiaPWu3JEpwl2YDeEbqo
```

### 2. Configuración ya Incluida

El módulo ya está configurado en:

- ✅ `src/common/config/configuration.ts` - Variables de entorno
- ✅ `src/app.module.ts` - Importación del módulo
- ✅ `src/modules/upload/upload.service.ts` - Configuración de Cloudinary

---

## 📋 Base URL

```
http://localhost:4000/api/v1/upload
```

---

## 🔗 Endpoints Disponibles

### 1. 📤 Subir Una Imagen

**POST** `/upload/single`

Sube una sola imagen a Cloudinary y genera automáticamente múltiples tamaños optimizados.

#### Request

**Content-Type:** `multipart/form-data`

**Form Data:**

- `file`: Archivo de imagen (jpg, png, gif, webp, etc.)

#### cURL Example

```bash
curl -X POST http://localhost:4000/api/v1/upload/single \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

#### JavaScript/Fetch Example

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:4000/api/v1/upload/single", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data);
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "original": {
      "publicId": "ecommerce/abc123def456",
      "url": "http://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/abc123def456.jpg",
      "secureUrl": "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/abc123def456.jpg",
      "width": 2048,
      "height": 1536,
      "format": "jpg",
      "bytes": 245678
    },
    "sizes": {
      "small": {
        "width": 150,
        "height": 150,
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_150,q_auto,w_150/ecommerce/abc123def456"
      },
      "medium": {
        "width": 400,
        "height": 400,
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_400,q_auto,w_400/ecommerce/abc123def456"
      },
      "large": {
        "width": 800,
        "height": 800,
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_800,q_auto,w_800/ecommerce/abc123def456"
      },
      "xlarge": {
        "width": 1200,
        "height": 1200,
        "url": "https://res.cloudinary.com/dyfvo7wal/image/upload/c_fill,f_auto,g_auto,h_1200,q_auto,w_1200/ecommerce/abc123def456"
      }
    }
  }
}
```

---

### 2. 📤 Subir Múltiples Imágenes

**POST** `/upload/multiple`

Sube hasta 10 imágenes simultáneamente a Cloudinary.

#### Request

**Content-Type:** `multipart/form-data`

**Form Data:**

- `files`: Array de archivos de imagen (máximo 10)

#### cURL Example

```bash
curl -X POST http://localhost:4000/api/v1/upload/multiple \
  -F "files=@/ruta/imagen1.jpg" \
  -F "files=@/ruta/imagen2.jpg" \
  -F "files=@/ruta/imagen3.jpg"
```

#### JavaScript/Fetch Example

```javascript
const formData = new FormData();
const files = fileInput.files; // HTMLInputElement con multiple

for (let i = 0; i < files.length; i++) {
  formData.append("files", files[i]);
}

const response = await fetch("http://localhost:4000/api/v1/upload/multiple", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data);
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": [
    {
      "original": {
        "publicId": "ecommerce/abc123def456",
        "url": "https://...",
        "secureUrl": "https://...",
        "width": 2048,
        "height": 1536,
        "format": "jpg",
        "bytes": 245678
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
        "publicId": "ecommerce/xyz789ghi012",
        "url": "https://...",
        "secureUrl": "https://...",
        "width": 1920,
        "height": 1080,
        "format": "png",
        "bytes": 189234
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

---

### 3. 🗑️ Eliminar Una Imagen

**DELETE** `/upload/single`

Elimina una imagen de Cloudinary usando su `publicId`.

#### Request Body

```json
{
  "publicId": "ecommerce/abc123def456"
}
```

#### cURL Example

```bash
curl -X DELETE http://localhost:4000/api/v1/upload/single \
  -H "Content-Type: application/json" \
  -d '{"publicId": "ecommerce/abc123def456"}'
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

---

### 4. 🗑️ Eliminar Múltiples Imágenes

**DELETE** `/upload/multiple`

Elimina múltiples imágenes de Cloudinary.

#### Request Body

```json
{
  "publicIds": [
    "ecommerce/abc123def456",
    "ecommerce/xyz789ghi012",
    "ecommerce/qwe456rty789"
  ]
}
```

#### cURL Example

```bash
curl -X DELETE http://localhost:4000/api/v1/upload/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "publicIds": [
      "ecommerce/abc123def456",
      "ecommerce/xyz789ghi012"
    ]
  }'
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "deleted": ["ecommerce/abc123def456", "ecommerce/xyz789ghi012"]
  }
}
```

---

## 🎨 Tamaños de Imagen Generados

Cada imagen subida genera automáticamente 4 variantes optimizadas:

| Tamaño   | Dimensiones | Uso Recomendado               |
| -------- | ----------- | ----------------------------- |
| `small`  | 150x150     | Thumbnails, avatares pequeños |
| `medium` | 400x400     | Grids de productos, previews  |
| `large`  | 800x800     | Vista de producto individual  |
| `xlarge` | 1200x1200   | Galería de imágenes, zoom     |

### Características de las Transformaciones

- **Crop:** `fill` - Recorta y rellena para mantener aspect ratio
- **Gravity:** `auto` - Enfoque automático en la parte más importante
- **Quality:** `auto` - Optimización automática de calidad
- **Format:** `auto` - Conversión automática a WebP cuando sea posible

---

## 📊 Estructura de la Respuesta

### UploadResult Interface

```typescript
interface UploadResult {
  original: {
    publicId: string; // ID único en Cloudinary
    url: string; // URL HTTP
    secureUrl: string; // URL HTTPS
    width: number; // Ancho original
    height: number; // Alto original
    format: string; // Formato (jpg, png, webp, etc.)
    bytes: number; // Tamaño en bytes
  };
  sizes: {
    small: ImageSize; // 150x150
    medium: ImageSize; // 400x400
    large: ImageSize; // 800x800
    xlarge: ImageSize; // 1200x1200
  };
}

interface ImageSize {
  width: number;
  height: number;
  url: string;
}
```

---

## 🛡️ Validaciones y Seguridad

### Validaciones Implementadas

1. **Tipo de archivo:**
   - Solo se aceptan archivos de imagen
   - Validación de MIME type (`image/*`)

2. **Cantidad de archivos:**
   - Máximo 10 archivos en upload múltiple

3. **Tamaño de archivo:**
   - Limitado por Cloudinary (default: 10MB para plan gratuito)

### Errores Comunes

#### 400 - Bad Request

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/upload/single",
  "method": "POST",
  "statusCode": 400,
  "error": {
    "message": "El archivo debe ser una imagen (jpg, png, gif, webp, etc.)"
  }
}
```

#### 400 - No File Provided

```json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/upload/single",
  "method": "POST",
  "statusCode": 400,
  "error": {
    "message": "No se proporcionó ningún archivo"
  }
}
```

---

## 🧪 Ejemplos de Integración

### React Component

```jsx
import React, { useState } from "react";

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/upload/single",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success) {
        setImageData(result.data);
        console.log("Original:", result.data.original.secureUrl);
        console.log("Medium:", result.data.sizes.medium.url);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && <p>Subiendo...</p>}

      {imageData && (
        <div>
          <h3>Imagen Original:</h3>
          <img
            src={imageData.original.secureUrl}
            alt="Original"
            style={{ maxWidth: "200px" }}
          />

          <h3>Tamaños Generados:</h3>
          <div>
            <img src={imageData.sizes.small.url} alt="Small" />
            <img src={imageData.sizes.medium.url} alt="Medium" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
```

### Vue.js Component

```vue
<template>
  <div>
    <input
      type="file"
      accept="image/*"
      @change="handleUpload"
      :disabled="uploading"
    />

    <div v-if="uploading">Subiendo...</div>

    <div v-if="imageData">
      <h3>Imagen Original:</h3>
      <img
        :src="imageData.original.secureUrl"
        alt="Original"
        style="max-width: 200px"
      />

      <h3>Tamaños:</h3>
      <img :src="imageData.sizes.small.url" alt="Small" />
      <img :src="imageData.sizes.medium.url" alt="Medium" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploading: false,
      imageData: null,
    };
  },
  methods: {
    async handleUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/upload/single",
          {
            method: "POST",
            body: formData,
          },
        );

        const result = await response.json();

        if (result.success) {
          this.imageData = result.data;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>
```

### Angular Service

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

interface UploadResponse {
  success: boolean;
  data: UploadResult;
}

@Injectable({
  providedIn: "root",
})
export class UploadService {
  private apiUrl = "http://localhost:4000/api/v1/upload";

  constructor(private http: HttpClient) {}

  uploadSingle(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.post<UploadResponse>(`${this.apiUrl}/single`, formData);
  }

  uploadMultiple(files: File[]): Observable<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/multiple`, formData);
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/single`, {
      body: { publicId },
    });
  }
}
```

---

## 📝 Casos de Uso

### 1. Upload de Imagen de Producto

```javascript
// Subir imagen principal de producto
const uploadProductImage = async (productId, imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("http://localhost:4000/api/v1/upload/single", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    // Guardar URLs en la base de datos
    await updateProduct(productId, {
      imageOriginal: result.data.original.secureUrl,
      imageSmall: result.data.sizes.small.url,
      imageMedium: result.data.sizes.medium.url,
      imageLarge: result.data.sizes.large.url,
      publicId: result.data.original.publicId,
    });
  }
};
```

### 2. Galería de Producto (Múltiples Imágenes)

```javascript
// Subir galería de producto
const uploadProductGallery = async (productId, imageFiles) => {
  const formData = new FormData();

  imageFiles.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("http://localhost:4000/api/v1/upload/multiple", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    // Guardar todas las URLs
    const gallery = result.data.map((img) => ({
      publicId: img.original.publicId,
      original: img.original.secureUrl,
      small: img.sizes.small.url,
      medium: img.sizes.medium.url,
      large: img.sizes.large.url,
      xlarge: img.sizes.xlarge.url,
    }));

    await updateProduct(productId, { gallery });
  }
};
```

### 3. Actualizar Imagen (Eliminar antigua y subir nueva)

```javascript
// Reemplazar imagen
const replaceProductImage = async (productId, oldPublicId, newImageFile) => {
  // 1. Eliminar imagen antigua
  await fetch("http://localhost:4000/api/v1/upload/single", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId: oldPublicId }),
  });

  // 2. Subir nueva imagen
  const formData = new FormData();
  formData.append("file", newImageFile);

  const response = await fetch("http://localhost:4000/api/v1/upload/single", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    // Actualizar producto con nueva imagen
    await updateProduct(productId, {
      imageOriginal: result.data.original.secureUrl,
      imageMedium: result.data.sizes.medium.url,
      publicId: result.data.original.publicId,
    });
  }
};
```

---

## 🔧 Personalización

### Modificar Tamaños de Imagen

Edita `src/modules/upload/upload.service.ts`:

```typescript
private generateImageSizes(publicId: string) {
  const sizes = [
    { name: "thumbnail", width: 100, height: 100 },
    { name: "small", width: 150, height: 150 },
    { name: "medium", width: 400, height: 400 },
    { name: "large", width: 800, height: 800 },
    { name: "xlarge", width: 1200, height: 1200 },
    { name: "xxlarge", width: 1920, height: 1920 },
  ];

  // ... rest of the code
}
```

### Cambiar Carpeta en Cloudinary

```typescript
private uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mi-carpeta-personalizada", // ← Cambiar aquí
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
      // ...
    );
  });
}
```

---

## 📚 Documentación Swagger

Accede a la documentación interactiva en:

```
http://localhost:4000/api/v1/docs
```

Busca la sección **upload** para probar los endpoints directamente desde Swagger UI.

---

## 🎯 Beneficios

### ✅ Para el Proyecto

- No consume espacio en el servidor
- CDN global de Cloudinary para carga rápida
- Optimización automática de imágenes
- Transformaciones on-the-fly
- Backup automático en la nube

### ✅ Para el Usuario

- Carga rápida de imágenes desde cualquier ubicación
- Mejor experiencia de usuario
- Imágenes responsivas automáticas
- Formato WebP automático en navegadores compatibles

### ✅ Para el Desarrollador

- API simple y consistente
- Múltiples tamaños generados automáticamente
- Manejo de errores robusto
- TypeScript types incluidos
- Fácil integración con cualquier frontend

---

## 🔄 Próximas Mejoras

- [ ] Soporte para videos
- [ ] Watermarks automáticos
- [ ] Redimensionamiento dinámico
- [ ] Compresión de imágenes más agresiva
- [ ] Límites de tamaño configurables
- [ ] Upload directo desde URL
- [ ] Generación de imágenes placeholder

---

**Módulo listo para usar! 🚀**

Para cualquier duda, consulta la documentación de Cloudinary: https://cloudinary.com/documentation
