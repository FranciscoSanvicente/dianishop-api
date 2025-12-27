import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { BrandsService, PaginatedResult } from "./brands.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { FilterBrandsDto } from "./dto/filter-brands.dto";
import { Brand } from "./entities/brand.entity";

@ApiTags("brands")
@Controller("brands")
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva marca" })
  @ApiResponse({ status: 201, description: "Marca creada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({
    summary: "Obtener marcas con filtros, ordenamiento y paginación",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de marcas obtenida exitosamente",
  })
  findAll(
    @Query() filterDto: FilterBrandsDto,
  ): Promise<PaginatedResult<Brand>> {
    return this.brandsService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una marca por ID" })
  @ApiResponse({ status: 200, description: "Marca encontrada" })
  @ApiResponse({ status: 404, description: "Marca no encontrada" })
  findOne(@Param("id") id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar una marca" })
  @ApiResponse({ status: 200, description: "Marca actualizada exitosamente" })
  @ApiResponse({ status: 404, description: "Marca no encontrada" })
  update(@Param("id") id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una marca" })
  @ApiResponse({ status: 200, description: "Marca eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Marca no encontrada" })
  remove(@Param("id") id: string) {
    return this.brandsService.remove(+id);
  }
}
