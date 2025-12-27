import {
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderSimpleDto {
  @ApiProperty({
    description: "ID del usuario que realiza la orden",
    example: 1,
  })
  @IsNumber({}, { message: "El ID del usuario debe ser un número" })
  @IsPositive({ message: "El ID del usuario debe ser positivo" })
  user_id: number;

  @ApiProperty({
    description: "ID del estado de la orden",
    example: 1,
  })
  @IsNumber({}, { message: "El ID del estado debe ser un número" })
  @IsPositive({ message: "El ID del estado debe ser positivo" })
  status_id: number;

  @ApiProperty({
    description: "Total de la orden",
    example: 199.98,
    minimum: 0.01,
  })
  @IsNumber({}, { message: "El total debe ser un número" })
  @IsPositive({ message: "El total debe ser positivo" })
  total: number;

  @ApiProperty({
    description: "ID del método de pago",
    example: 1,
  })
  @IsNumber({}, { message: "El ID del método de pago debe ser un número" })
  @IsPositive({ message: "El ID del método de pago debe ser positivo" })
  payment_method_id: number;

  @ApiProperty({
    description: "Dirección de entrega",
    example: "Calle 123, Ciudad, País",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "La dirección debe ser una cadena de texto" })
  address?: string;

  @ApiProperty({
    description: "Productos de la orden",
    example: [
      {
        product_id: 1,
        quantity: 2,
        price: 99.99,
      },
    ],
  })
  @IsArray({ message: "Los productos deben ser un array" })
  products: any[]; // Sin validación anidada por ahora
}










