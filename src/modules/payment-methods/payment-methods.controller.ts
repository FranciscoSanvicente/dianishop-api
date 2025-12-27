import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PaymentMethodsService } from "./payment-methods.service";
import { PaymentMethods } from "./entities/payment-methods.entity";

@ApiTags("payment-methods")
@Controller("payment-methods")
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: "Obtener todos los métodos de pago" })
  @ApiResponse({
    status: 200,
    description: "Lista de métodos de pago obtenida exitosamente",
  })
  findAll(): Promise<PaymentMethods[]> {
    return this.paymentMethodsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un método de pago por ID" })
  @ApiResponse({ status: 200, description: "Método de pago encontrado" })
  @ApiResponse({ status: 404, description: "Método de pago no encontrado" })
  findOne(@Param("id") id: string): Promise<PaymentMethods | null> {
    return this.paymentMethodsService.findOne(+id);
  }
}
