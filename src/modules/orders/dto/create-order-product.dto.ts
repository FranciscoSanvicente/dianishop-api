import { IsNumber, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderProductDto {
  @ApiProperty({
    description: "ID del producto",
    example: 1,
  })
  @IsNumber({}, { message: "El ID del producto debe ser un número" })
  @IsPositive({ message: "El ID del producto debe ser positivo" })
  product_id: number;

  @ApiProperty({
    description: "Cantidad del producto",
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: "La cantidad debe ser un número" })
  @Min(1, { message: "La cantidad debe ser al menos 1" })
  quantity: number;

  @ApiProperty({
    description: "Precio unitario del producto al momento de la orden",
    example: 99.99,
    minimum: 0.01,
  })
  @IsNumber({}, { message: "El precio debe ser un número" })
  @IsPositive({ message: "El precio debe ser positivo" })
  price: number;
}


