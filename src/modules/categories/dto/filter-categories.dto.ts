import { Type } from "class-transformer";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum CategorySortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  ID = "id",
}

export class FilterCategoriesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar por nombre de categoría (búsqueda parcial)",
    example: "electrónicos",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Filtrar por slug de categoría",
    example: "electronics",
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: "Campo por el cual ordenar",
    enum: CategorySortBy,
    example: CategorySortBy.NAME,
  })
  @IsOptional()
  @IsEnum(CategorySortBy)
  sortBy?: CategorySortBy = CategorySortBy.NAME;

  @ApiPropertyOptional({
    description: "Orden de clasificación",
    enum: SortOrder,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
