import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Order } from "./entities/order.entity";
import { OrderProducts } from "./entities/order-products.entity";
import { Users } from "../users/entities/users.entity";
import { OrderStatus } from "../order-status/entities/order-status.entity";
import { PaymentMethods } from "../payment-methods/entities/payment-methods.entity";
import { Product } from "../products/entities/product.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      OrderProducts,
      Users,
      OrderStatus,
      PaymentMethods,
      Product,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
