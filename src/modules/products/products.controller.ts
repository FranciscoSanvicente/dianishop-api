import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import {
  ProductsService,
  PaginatedResult,
  ProductWithImages,
} from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilterProductsDto } from "./dto/filter-products.dto";
import { Product } from "./entities/product.entity";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({ status: 201, description: "Producto creado exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductWithImages> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: "Obtener productos con filtros, ordenamiento y paginación",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de productos obtenida exitosamente",
  })
  findAll(
    @Query() filterDto: FilterProductsDto,
  ): Promise<PaginatedResult<ProductWithImages>> {
    return this.productsService.findAll(filterDto);
  }

  @Get("in-stock")
  @ApiOperation({ summary: "Obtener solo productos disponibles en stock" })
  @ApiResponse({ status: 200, description: "Lista de productos en stock" })
  findInStock() {
    return this.productsService.findProductsInStock();
  }

  @Get("category/:categoryId")
  @ApiOperation({ summary: "Obtener productos por categoría" })
  @ApiParam({ name: "categoryId", description: "ID de la categoría" })
  @ApiResponse({
    status: 200,
    description: "Lista de productos de la categoría",
  })
  findByCategory(@Param("categoryId", ParseIntPipe) categoryId: number) {
    return this.productsService.findProductsByCategory(categoryId);
  }

  @Get("brand/:brandId")
  @ApiOperation({ summary: "Obtener productos por marca" })
  @ApiParam({ name: "brandId", description: "ID de la marca" })
  @ApiResponse({ status: 200, description: "Lista de productos de la marca" })
  findByBrand(@Param("brandId", ParseIntPipe) brandId: number) {
    return this.productsService.findProductsByBrand(brandId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un producto por ID" })
  @ApiParam({ name: "id", description: "ID del producto" })
  @ApiResponse({ status: 200, description: "Producto encontrado" })
  @ApiResponse({ status: 404, description: "Producto no encontrado" })
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ProductWithImages | null> {
    return this.productsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar completamente un producto" })
  @ApiParam({ name: "id", description: "ID del producto" })
  @ApiResponse({
    status: 200,
    description: "Producto actualizado exitosamente",
  })
  @ApiResponse({ status: 404, description: "Producto no encontrado" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductWithImages | null> {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(":id/stock")
  @ApiOperation({ summary: "Actualizar solo el stock de un producto" })
  @ApiParam({ name: "id", description: "ID del producto" })
  @ApiResponse({ status: 200, description: "Stock actualizado exitosamente" })
  @ApiResponse({ status: 404, description: "Producto no encontrado" })
  updateStock(
    @Param("id", ParseIntPipe) id: number,
    @Body("stock", ParseIntPipe) stock: number,
  ) {
    return this.productsService.updateStock(id, stock);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Eliminar un producto" })
  @ApiParam({ name: "id", description: "ID del producto" })
  @ApiResponse({ status: 204, description: "Producto eliminado exitosamente" })
  @ApiResponse({ status: 404, description: "Producto no encontrado" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
