import { IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export enum OrderSortBy {
  ID = "id",
  TOTAL = "total",
  DATE = "date",
  USER_ID = "user_id",
  STATUS_ID = "status_id",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class FilterOrdersDto extends PaginationQueryDto {
  @ApiProperty({
    description: "Filtrar por ID de usuario",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "El ID del usuario debe ser un número" })
  user_id?: number;

  @ApiProperty({
    description: "Filtrar por ID de estado",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "El ID del estado debe ser un número" })
  status_id?: number;

  @ApiProperty({
    description: "Filtrar por ID de método de pago",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "El ID del método de pago debe ser un número" })
  payment_method_id?: number;

  @ApiProperty({
    description: "Filtrar por total mínimo",
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "El total mínimo debe ser un número" })
  minTotal?: number;

  @ApiProperty({
    description: "Filtrar por total máximo",
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "El total máximo debe ser un número" })
  maxTotal?: number;

  @ApiProperty({
    description: "Filtrar por dirección (búsqueda parcial)",
    example: "Calle 123",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "La dirección debe ser una cadena de texto" })
  address?: string;

  @ApiProperty({
    description: "Filtrar por fecha desde (YYYY-MM-DD)",
    example: "2024-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: "La fecha desde debe ser una fecha válida" })
  dateFrom?: string;

  @ApiProperty({
    description: "Filtrar por fecha hasta (YYYY-MM-DD)",
    example: "2024-12-31",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: "La fecha hasta debe ser una fecha válida" })
  dateTo?: string;

  @ApiProperty({
    description: "Campo por el cual ordenar",
    enum: OrderSortBy,
    default: OrderSortBy.DATE,
    required: false,
  })
  @IsOptional()
  sortBy?: OrderSortBy;

  @ApiProperty({
    description: "Orden de clasificación",
    enum: SortOrder,
    default: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  sortOrder?: SortOrder;
}
