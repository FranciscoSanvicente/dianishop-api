import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  Length,
  IsPositive,
  IsInt,
  IsUUID,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ProductImageDto } from "./product-image.dto";

export class CreateProductDto {
  @ApiProperty({
    description: "Nombre del producto",
    example: "iPhone 15 Pro",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({
    description: "Descripción detallada del producto",
    example: "El último smartphone de Apple con chip A17 Pro",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: "Precio actual del producto",
    example: 999.99,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  price: number;

  @ApiPropertyOptional({
    description: "Precio original antes de descuento",
    example: 1199.99,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  originalPrice?: number;

  @ApiPropertyOptional({
    description: "Calificación del producto (1-5)",
    example: 4.5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: "Número de reseñas",
    example: 128,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  reviews?: number;

  @ApiPropertyOptional({
    description: "Si el producto está disponible en stock",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: "Si el producto es destacado (featured)",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: "Cantidad disponible en stock",
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: "Código SKU único del producto",
    example: "IPH15-PRO-256-BLU",
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  sku?: string;

  @ApiProperty({
    description: "ID de la categoría del producto",
    example: 1,
  })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: "ID de la marca del producto",
    example: 1,
  })
  @IsInt()
  @IsPositive()
  brandId: number;

  @ApiPropertyOptional({
    description: "Array de imágenes del producto con diferentes tamaños",
    type: [ProductImageDto],
    example: [
      {
        size: "150x150",
        public_id: "ecommerce/product1.jpg",
        url: "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/product1.jpg",
      },
      {
        size: "400x400",
        public_id: "ecommerce/product1.jpg",
        url: "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/product1.jpg",
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
