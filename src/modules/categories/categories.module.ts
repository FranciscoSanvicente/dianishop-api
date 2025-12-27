import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoriesImagesService } from "./categories-images.service";
import { Category } from "./entities/category.entity";
import { CategoriesImages } from "./entities/categories-images.entity";
import { SizeImages } from "../upload/entities/size-images.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Category, CategoriesImages, SizeImages]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesImagesService],
  exports: [CategoriesService, CategoriesImagesService],
})
export class CategoriesModule {}
