import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { SizeImagesService } from "./size-images.service";
import { SizeImages } from "./entities/size-images.entity";

@Module({
  imports: [SequelizeModule.forFeature([SizeImages])],
  controllers: [UploadController],
  providers: [UploadService, SizeImagesService],
  exports: [UploadService, SizeImagesService],
})
export class UploadModule {}
