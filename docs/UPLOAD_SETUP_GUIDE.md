# 🚀 Guía Rápida - Módulo de Upload

## ✅ Estado de Implementación

El módulo de upload de imágenes con Cloudinary está **100% implementado** y listo para usar.

---

## 📋 Archivos Creados/Modificados

### ✨ Nuevos Archivos

1. **src/modules/upload/upload.service.ts** - Servicio principal de upload
2. **src/modules/upload/upload.controller.ts** - Controlador con endpoints
3. **src/modules/upload/upload.module.ts** - Módulo de NestJS
4. **UPLOAD_MODULE_DOCUMENTATION.md** - Documentación completa
5. **ENV_VARIABLES.md** - Documentación de variables de entorno
6. **test-upload.html** - Interfaz de prueba interactiva
7. **UPLOAD_SETUP_GUIDE.md** - Esta guía

### 🔧 Archivos Modificados

1. **src/common/config/configuration.ts** - Agregada configuración de Cloudinary
2. **src/app.module.ts** - Importado UploadModule
3. **API_DOCUMENTATION.md** - Actualizada con módulo de upload

---

## 🎯 Pasos para Usar el Módulo

### 1️⃣ Configurar Variables de Entorno

Crea o actualiza tu archivo `.env` en la raíz del proyecto:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dyfvo7wal
CLOUDINARY_API_KEY=322959825232166
CLOUDINARY_API_SECRET=hLySmMhfiaPWu3JEpwl2YDeEbqo
```

> **Nota:** Las credenciales ya están configuradas para tu cuenta de Cloudinary.

### 2️⃣ Instalar Dependencias (si es necesario)

El paquete `cloudinary` ya debería estar instalado. Si no lo está:

```bash
npm install cloudinary
npm install --save-dev @types/multer
```

### 3️⃣ Iniciar el Servidor

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

### 4️⃣ Probar el Módulo

#### Opción A: Interfaz de Prueba (Recomendado)

1. Abre el archivo `test-upload.html` en tu navegador
2. Asegúrate de que el servidor esté corriendo en `http://localhost:4000`
3. Prueba subir imágenes individuales o múltiples

#### Opción B: Swagger UI

1. Ve a `http://localhost:4000/api/v1/docs`
2. Busca la sección **upload**
3. Prueba los endpoints directamente desde Swagger

#### Opción C: cURL

```bash
# Subir una imagen
curl -X POST http://localhost:4000/api/v1/upload/single \
  -F "file=@/ruta/a/tu/imagen.jpg"

# Eliminar una imagen
curl -X DELETE http://localhost:4000/api/v1/upload/single \
  -H "Content-Type: application/json" \
  -d '{"publicId": "ecommerce/abc123def456"}'
```

---

## 🔗 Endpoints Disponibles

### 📤 Upload Single Image

**POST** `/api/v1/upload/single`

- Content-Type: `multipart/form-data`
- Field: `file`
- Responde con imagen original + 4 tamaños optimizados

### 📤 Upload Multiple Images

**POST** `/api/v1/upload/multiple`

- Content-Type: `multipart/form-data`
- Field: `files` (array, máximo 10)
- Responde con array de imágenes

### 🗑️ Delete Single Image

**DELETE** `/api/v1/upload/single`

- Content-Type: `application/json`
- Body: `{ "publicId": "ecommerce/abc123def456" }`

### 🗑️ Delete Multiple Images

**DELETE** `/api/v1/upload/multiple`

- Content-Type: `application/json`
- Body: `{ "publicIds": ["id1", "id2"] }`

---

## 📸 Tamaños de Imagen Generados

Cada imagen subida genera automáticamente:

| Tamaño   | Dimensiones | Uso Recomendado      |
| -------- | ----------- | -------------------- |
| Small    | 150x150     | Thumbnails, avatares |
| Medium   | 400x400     | Grid de productos    |
| Large    | 800x800     | Vista individual     |
| XLarge   | 1200x1200   | Galería, zoom        |
| Original | Original    | Archivo maestro      |

---

## 💻 Ejemplo de Uso en Frontend

### React

```jsx
import React, { useState } from "react";

function ImageUploader() {
  const [imageData, setImageData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:4000/api/v1/upload/single", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      setImageData(result.data);
      // Usar: result.data.original.secureUrl
      // Usar: result.data.sizes.medium.url
    }
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
}
```

### JavaScript Vanilla

```javascript
const input = document.querySelector('input[type="file"]');

input.addEventListener("change", async (e) => {
  const formData = new FormData();
  formData.append("file", e.target.files[0]);

  const response = await fetch("http://localhost:4000/api/v1/upload/single", {
    method: "POST",
    body: formData,
  });

  const { data } = await response.json();
  console.log("Original:", data.original.secureUrl);
  console.log("Medium:", data.sizes.medium.url);
});
```

---

## 🎨 Características Implementadas

- ✅ **Upload de imágenes** (individual y múltiple)
- ✅ **Optimización automática** de calidad
- ✅ **Conversión automática** a WebP
- ✅ **4 tamaños diferentes** generados automáticamente
- ✅ **Eliminación de imágenes** de Cloudinary
- ✅ **Validación de tipos** de archivo
- ✅ **Manejo de errores** robusto
- ✅ **Logging** para debugging
- ✅ **Documentación Swagger** automática
- ✅ **TypeScript** types completos
- ✅ **Interfaz de prueba** interactiva

---

## 📚 Documentación Completa

Para más detalles, consulta:

- **UPLOAD_MODULE_DOCUMENTATION.md** - Documentación completa del módulo
- **ENV_VARIABLES.md** - Todas las variables de entorno
- **API_DOCUMENTATION.md** - Documentación general de la API
- **Swagger UI** - http://localhost:4000/api/v1/docs

---

## 🔍 Troubleshooting

### Error: "CLOUDINARY_CLOUD_NAME no está definido"

**Solución:** Verifica que el archivo `.env` existe y contiene las variables de Cloudinary.

### Error: "El archivo debe ser una imagen"

**Solución:** Solo se aceptan archivos de tipo imagen (jpg, png, gif, webp, etc.)

### Error: CORS

**Solución:** Agrega tu URL al array `CORS_ORIGIN` en el archivo `.env`

### Error: "No se proporcionó ningún archivo"

**Solución:** Asegúrate de enviar el archivo con el nombre de campo correcto (`file` o `files`)

---

## 🎯 Próximos Pasos

Ahora puedes:

1. ✅ Integrar el upload en tu módulo de productos
2. ✅ Guardar las URLs en la base de datos
3. ✅ Crear galerías de imágenes para productos
4. ✅ Implementar avatares de usuario
5. ✅ Usar las diferentes URLs según el contexto

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la documentación completa en `UPLOAD_MODULE_DOCUMENTATION.md`
2. Prueba con la interfaz de prueba `test-upload.html`
3. Verifica los logs del servidor
4. Revisa la documentación de Cloudinary: https://cloudinary.com/documentation

---

**¡El módulo está listo para usar! 🚀**

Desarrollado con ❤️ usando NestJS + Cloudinary
