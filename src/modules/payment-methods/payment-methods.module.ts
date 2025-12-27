import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PaymentMethodsController } from "./payment-methods.controller";
import { PaymentMethodsService } from "./payment-methods.service";
import { PaymentMethods } from "./entities/payment-methods.entity";

@Module({
  imports: [SequelizeModule.forFeature([PaymentMethods])],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
