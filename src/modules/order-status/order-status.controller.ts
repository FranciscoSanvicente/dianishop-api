import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OrderStatusService } from "./order-status.service";
import { OrderStatus } from "./entities/order-status.entity";

@ApiTags("order-status")
@Controller("order-status")
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get()
  @ApiOperation({ summary: "Obtener todos los estados de orden" })
  @ApiResponse({
    status: 200,
    description: "Lista de estados de orden obtenida exitosamente",
  })
  findAll(): Promise<OrderStatus[]> {
    return this.orderStatusService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un estado de orden por ID" })
  @ApiResponse({ status: 200, description: "Estado de orden encontrado" })
  @ApiResponse({ status: 404, description: "Estado de orden no encontrado" })
  findOne(@Param("id") id: string): Promise<OrderStatus | null> {
    return this.orderStatusService.findOne(+id);
  }
}
