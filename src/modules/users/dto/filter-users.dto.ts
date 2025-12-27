import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export enum UserSortBy {
  ID = "id",
  EMAIL = "email",
  FULL_NAME = "full_name",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class FilterUsersDto extends PaginationQueryDto {
  @ApiProperty({
    description: "Filtrar por email",
    example: "usuario@ejemplo.com",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Debe proporcionar un email válido" })
  email?: string;

  @ApiProperty({
    description: "Filtrar por nombre completo",
    example: "Juan",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  full_name?: string;

  @ApiProperty({
    description: "Campo por el cual ordenar",
    enum: UserSortBy,
    default: UserSortBy.ID,
    required: false,
  })
  @IsOptional()
  sortBy?: UserSortBy;

  @ApiProperty({
    description: "Orden de clasificación",
    enum: SortOrder,
    default: SortOrder.ASC,
    required: false,
  })
  @IsOptional()
  sortOrder?: SortOrder;
}
