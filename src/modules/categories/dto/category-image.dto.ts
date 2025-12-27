import { IsString, IsNotEmpty, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryImageDto {
  @ApiProperty({
    description: "Tamaño de la imagen",
    example: "150x150",
    enum: ["150x150", "400x400", "800x800", "1200x1200", "original"],
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    description: "URL de la imagen en Cloudinary",
    example:
      "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/abc123def456.jpg",
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: "Public ID de la imagen en Cloudinary para eliminación",
    example: "ecommerce/category/abc123def456",
  })
  @IsString()
  @IsNotEmpty()
  public_id: string;
}

export class CreateCategoryImagesDto {
  @ApiProperty({
    description: "Array de imágenes con sus tamaños",
    type: [CategoryImageDto],
    example: [
      {
        size: "150x150",
        url: "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/abc123def456.jpg",
        public_id: "ecommerce/category/abc123def456",
      },
      {
        size: "400x400",
        url: "https://res.cloudinary.com/dyfvo7wal/image/upload/v1234567890/ecommerce/abc123def456.jpg",
        public_id: "ecommerce/category/abc123def456",
      },
    ],
  })
  @IsNotEmpty()
  images: CategoryImageDto[];
}
