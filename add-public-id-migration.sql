-- Script para agregar el campo public_id a las tablas de imágenes

-- 1. Agregar public_id a la tabla product_images
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS public_id TEXT NOT NULL DEFAULT '';

-- 2. Agregar public_id a la tabla categories_images  
ALTER TABLE categories_images 
ADD COLUMN IF NOT EXISTS public_id TEXT NOT NULL DEFAULT '';

-- 3. Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'product_images' 
AND column_name = 'public_id';

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories_images' 
AND column_name = 'public_id';

-- 4. Mostrar estructura de las tablas
\d product_images;
\d categories_images;
