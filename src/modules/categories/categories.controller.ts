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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import {
  CategoriesService,
  PaginatedResult,
  CategoryWithImages,
} from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { FilterCategoriesDto } from "./dto/filter-categories.dto";
import { Category } from "./entities/category.entity";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva categoría" })
  @ApiResponse({ status: 201, description: "Categoría creada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: "Obtener categorías con filtros, ordenamiento y paginación",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de categorías obtenida exitosamente",
  })
  findAll(
    @Query() filterDto: FilterCategoriesDto,
  ): Promise<PaginatedResult<CategoryWithImages>> {
    return this.categoriesService.findAll(filterDto);
  }

  @Get("simple")
  @ApiOperation({
    summary: "Obtener categorías SIN imágenes (para diagnóstico)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de categorías obtenida exitosamente",
  })
  findAllSimple(
    @Query() filterDto: FilterCategoriesDto,
  ): Promise<PaginatedResult<any>> {
    return this.categoriesService.findAllWithoutImages(filterDto);
  }

  @Post("test-direct")
  async testDirect() {
    return { message: "Direct test endpoint working", timestamp: new Date() };
  }

  @Get("debug-simple/:id")
  @ApiOperation({
    summary: "Debug simple para investigar problemas con imágenes",
  })
  async debugCategorySimple(@Param("id") id: string) {
    return this.categoriesService.debugCategoryImages(+id);
  }

  @Get("debug/:id")
  @ApiOperation({
    summary: "Debug endpoint para investigar problemas con imágenes",
  })
  async debugCategory(@Param("id") id: string) {
    try {
      const categoryModel = this.categoriesService.getCategoryModel();
      const imagesService = this.categoriesService.getCategoriesImagesService();

      // Obtener la categoría
      const category = await categoryModel.findByPk(+id);
      if (!category) {
        return { error: `Categoría con ID ${id} no encontrada` };
      }

      // Intentar obtener las imágenes directamente
      const images = await imagesService.findByCategoryId(+id);

      // Obtener todos los tamaños disponibles
      const sizes = await imagesService.findAll();

      // Query SQL directo para debug
      const rawQuery = `
        SELECT 
          ci.id as image_id,
          ci.category_id,
          ci.size_id,
          ci.url,
          si.size
        FROM categories_images ci
        LEFT JOIN size_images si ON ci.size_id = si.id
        WHERE ci.category_id = ${id}
      `;

      const rawResults = await categoryModel.sequelize?.query(rawQuery, {
        type: "SELECT" as any,
      });

      return {
        category: category.toJSON(),
        imagesFromService: images,
        formattedImages: imagesService.formatImagesForResponse(images),
        allSizes: sizes,
        rawQueryResults: rawResults || [],
        debug: {
          categoryExists: !!category,
          imagesFound: images.length,
          sizesAvailable: sizes.length,
          rawResultsCount: rawResults?.length || 0,
        },
      };
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una categoría por ID" })
  @ApiResponse({ status: 200, description: "Categoría encontrada" })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar una categoría" })
  @ApiResponse({
    status: 200,
    description: "Categoría actualizada exitosamente",
  })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  update(@Param("id") id: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.update(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una categoría" })
  @ApiResponse({ status: 200, description: "Categoría eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Categoría no encontrada" })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(+id);
  }
}
