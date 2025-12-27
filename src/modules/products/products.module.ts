import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductImagesService } from "./product-images.service";
import { Product } from "./entities/product.entity";
import { ProductImages } from "./entities/product-images.entity";
import { SizeImages } from "../upload/entities/size-images.entity";

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductImages, SizeImages])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductImagesService],
  exports: [ProductsService, ProductImagesService],
})
export class ProductsModule {}
