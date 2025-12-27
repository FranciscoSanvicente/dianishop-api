import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductsModule } from "./modules/products/products.module";
import { BrandsModule } from "./modules/brands/brands.module";
import { OrderStatusModule } from "./modules/order-status/order-status.module";
import { PaymentMethodsModule } from "./modules/payment-methods/payment-methods.module";
import { UsersModule } from "./modules/users/users.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { UploadModule } from "./modules/upload/upload.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./common/config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    CategoriesModule,
    ProductsModule,
    BrandsModule,
    OrderStatusModule,
    PaymentMethodsModule,
    UsersModule,
    OrdersModule,
    UploadModule,
  ],
})
export class AppModule {}
