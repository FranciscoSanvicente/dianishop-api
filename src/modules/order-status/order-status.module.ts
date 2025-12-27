import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { OrderStatusController } from "./order-status.controller";
import { OrderStatusService } from "./order-status.service";
import { OrderStatus } from "./entities/order-status.entity";

@Module({
  imports: [SequelizeModule.forFeature([OrderStatus])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
