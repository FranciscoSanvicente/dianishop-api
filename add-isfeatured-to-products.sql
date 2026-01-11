-- Script para agregar el campo isFeatured a la tabla products

-- 1. Agregar isFeatured a la tabla products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- 2. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'isFeatured';
