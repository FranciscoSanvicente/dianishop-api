# 🔧 Solución para Error 500 al Crear Productos con Imágenes

## 🔍 Problema Identificado

Al intentar crear un producto con múltiples imágenes (15 imágenes: 3 archivos diferentes x 5 tamaños cada uno), se produce un **error 500 Internal Server Error**.

### Causa del Error

1. **Columna `public_id` no existe en la tabla `product_images`**
2. **Columna `public_id` no existe en la tabla `categories_images`**
3. El servidor necesita reiniciarse para que Sequelize cree las nuevas columnas

## ✅ Cambios Implementados

### 1. Entidades Actualizadas

#### `ProductImages` (`src/modules/products/entities/product-images.entity.ts`)

```typescript
@Column({ allowNull: false, type: DataType.TEXT })
public_id: string;  // ✅ NUEVO CAMPO
```

#### `CategoriesImages` (`src/modules/categories/entities/categories-images.entity.ts`)

```typescript
@Column({ allowNull: false, type: DataType.TEXT })
public_id: string;  // ✅ NUEVO CAMPO
```

### 2. DTOs Actualizados

#### `ProductImageDto` y `CategoryImageDto`

```typescript
@ApiProperty({
  description: "Public ID de la imagen en Cloudinary para eliminación",
  example: "ecommerce/product/abc123def456",
})
@IsString()
@IsNotEmpty()
public_id: string;  // ✅ NUEVO CAMPO
```

### 3. Servicio Mejorado para Múltiples Imágenes

**`ProductImagesService`** ahora maneja correctamente **múltiples imágenes del mismo tamaño**:

```typescript
// ✅ Genera size_id únicos:
// Primera imagen 150x150 -> "150x150"
// Segunda imagen 150x150 -> "150x150_2"
// Tercera imagen 150x150 -> "150x150_3"

const sizeCounter: { [key: string]: number } = {};

for (const imageDto of imagesDto.images) {
  if (!sizeCounter[imageDto.size]) {
    sizeCounter[imageDto.size] = 0;
  }
  sizeCounter[imageDto.size]++;

  const sizeId =
    sizeCounter[imageDto.size] === 1
      ? imageDto.size
      : `${imageDto.size}_${sizeCounter[imageDto.size]}`;

  // Guardar con size_id único
  await this.productImagesModel.create({
    product_id: productId,
    url: imageDto.url,
    size_id: sizeId,
    public_id: imageDto.public_id, // ✅ NUEVO CAMPO
  });
}
```

### 4. Formato de Respuesta

El método `formatImagesForResponse` ahora:

- ✅ Devuelve el `public_id` en la respuesta
- ✅ Extrae el tamaño real del `size_id` (elimina el sufijo `_2`, `_3`, etc.)

```typescript
// "150x150_2" -> devuelve size: "150x150"
// "400x400_3" -> devuelve size: "400x400"
let sizeValue = sizeIdFromData || "unknown";
if (sizeValue.includes("_")) {
  sizeValue = sizeValue.split("_")[0];
}

return {
  size: sizeValue, // "150x150" (sin sufijo)
  url: imageDto.url, // URL completa
  public_id: imageDto.public_id, // ✅ NUEVO CAMPO para eliminación
};
```

## 🚀 Pasos para Resolver el Error

### Paso 1: Reiniciar el Servidor

**IMPORTANTE:** El servidor debe reiniciarse para que Sequelize cree las columnas `public_id`.

```bash
# Detén el servidor actual (Ctrl+C)
# Luego reinícialo:
npm run start:dev
```

### Paso 2: Verificar que las Columnas se Crearon

Una vez reiniciado el servidor, verifica en los logs que Sequelize creó las columnas:

```
Executing (default): ALTER TABLE "product_images" ADD COLUMN "public_id" TEXT NOT NULL;
Executing (default): ALTER TABLE "categories_images" ADD COLUMN "public_id" TEXT NOT NULL;
```

### Paso 3: Probar la Creación de Productos

Ejecuta el script de prueba:

```bash
node test-user-data.js
```

Deberías ver:

```
✅ Producto creado exitosamente
- ID: 123
- Imágenes guardadas: 15
  1. 150x150: ecommerce/f8dud4rp1fwehhiuw1b2
  2. 400x400: ecommerce/f8dud4rp1fwehhiuw1b2
  3. 800x800: ecommerce/f8dud4rp1fwehhiuw1b2
  4. 1200x1200: ecommerce/f8dud4rp1fwehhiuw1b2
  5. original: ecommerce/f8dud4rp1fwehhiuw1b2
  6. 150x150: ecommerce/srbhhbmgz9hkh649ryok
  ...
```

## 📊 Formato de Data Soportado

Tu formato actual **ES CORRECTO** y ahora está completamente soportado:

```json
{
  "name": "Producto con Múltiples Imágenes",
  "price": 323,
  "categoryId": 1,
  "brandId": 6,
  "images": [
    // IMAGEN 1 (5 tamaños)
    {
      "size": "150x150",
      "url": "https://res.cloudinary.com/.../f8dud4rp1fwehhiuw1b2?...",
      "public_id": "ecommerce/f8dud4rp1fwehhiuw1b2"
    },
    {
      "size": "400x400",
      "url": "https://res.cloudinary.com/.../f8dud4rp1fwehhiuw1b2?...",
      "public_id": "ecommerce/f8dud4rp1fwehhiuw1b2"
    },
    // ... (3 tamaños más)

    // IMAGEN 2 (5 tamaños)
    {
      "size": "150x150", // ✅ MISMO TAMAÑO, diferente public_id
      "url": "https://res.cloudinary.com/.../srbhhbmgz9hkh649ryok?...",
      "public_id": "ecommerce/srbhhbmgz9hkh649ryok"
    }
    // ... (4 tamaños más)

    // IMAGEN 3 (5 tamaños)
    // ... (5 tamaños más)
  ]
}
```

## 🎯 Características Implementadas

✅ **Múltiples imágenes por producto** (sin límite)
✅ **Múltiples imágenes del mismo tamaño** (diferenciadas por `public_id`)
✅ **Campo `public_id`** guardado para eliminación posterior
✅ **Formato de respuesta normalizado** (tamaños sin sufijos)
✅ **Compatible con Cloudinary** (listo para eliminación de imágenes)

## 🔄 Siguientes Pasos

Una vez que el servidor se reinicie y las columnas se creen:

1. ✅ Probar creación de productos con múltiples imágenes
2. ✅ Probar actualización de productos
3. ✅ Probar eliminación de productos
4. 🔜 Implementar eliminación de imágenes de Cloudinary usando `public_id`
5. 🔜 Probar sistema completo

## ⚠️ Importante

- **NO** necesitas cambiar el formato de tu data
- **NO** necesitas modificar tu frontend
- **SÍ** necesitas reiniciar el servidor
- **SÍ** necesitas verificar que las columnas se crearon

## 📝 Resumen

El error 500 se debe a que la columna `public_id` no existe en la base de datos. Con `synchronize: true` configurado, Sequelize creará automáticamente la columna cuando reinicies el servidor.

**Acción inmediata:** Reinicia el servidor con `npm run start:dev`
