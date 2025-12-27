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
import { OrdersService, PaginatedResult } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CreateOrderSimpleDto } from "./dto/create-order-simple.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { FilterOrdersDto } from "./dto/filter-orders.dto";
import { Order } from "./entities/order.entity";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Crear una nueva orden" })
  @ApiResponse({ status: 201, description: "Orden creada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({
    status: 404,
    description: "Usuario, estado o método de pago no encontrado",
  })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Post("simple")
  @ApiOperation({ summary: "Crear una nueva orden (versión simplificada)" })
  createSimple(@Body() createOrderDto: any): Promise<Order> {
    console.log(
      "Creating order with simple DTO:",
      JSON.stringify(createOrderDto, null, 2),
    );
    return this.ordersService.create(createOrderDto as any);
  }

  @Get()
  @ApiOperation({
    summary: "Obtener órdenes con filtros, ordenamiento y paginación",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de órdenes obtenida exitosamente",
  })
  findAll(
    @Query() filterDto: FilterOrdersDto,
  ): Promise<PaginatedResult<Order>> {
    return this.ordersService.findAll(filterDto);
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Obtener órdenes de un usuario específico",
  })
  @ApiResponse({
    status: 200,
    description: "Órdenes del usuario obtenidas exitosamente",
  })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  findByUser(
    @Param("userId") userId: string,
    @Query() filterDto: FilterOrdersDto,
  ): Promise<PaginatedResult<Order>> {
    return this.ordersService.findByUser(+userId, filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una orden por ID" })
  @ApiResponse({ status: 200, description: "Orden encontrada" })
  @ApiResponse({ status: 404, description: "Orden no encontrada" })
  findOne(@Param("id") id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar una orden" })
  @ApiResponse({ status: 200, description: "Orden actualizada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 404, description: "Orden no encontrada" })
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    console.log("🎯 Controller: Update order ID:", id);
    console.log("📝 Controller: Update DTO:", JSON.stringify(updateOrderDto, null, 2));
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una orden" })
  @ApiResponse({ status: 200, description: "Orden eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Orden no encontrada" })
  remove(@Param("id") id: string): Promise<{ message: string }> {
    return this.ordersService.remove(+id);
  }
}
