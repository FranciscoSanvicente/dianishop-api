import { Type } from "class-transformer";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export enum BrandSortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  ID = "id",
}

export class FilterBrandsDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar por nombre de marca (búsqueda parcial)",
    example: "apple",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Campo por el cual ordenar",
    enum: BrandSortBy,
    example: BrandSortBy.NAME,
  })
  @IsOptional()
  @IsEnum(BrandSortBy)
  sortBy?: BrandSortBy = BrandSortBy.NAME;

  @ApiPropertyOptional({
    description: "Orden de clasificación",
    enum: SortOrder,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
