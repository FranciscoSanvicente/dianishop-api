import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from "@nestjs/swagger";
import { UploadService, UploadResult } from "./upload.service";

@ApiTags("upload")
@Controller({ path: "upload", version: "1" })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Sube una sola imagen a Cloudinary
   */
  @Post("single")
  @ApiOperation({ summary: "Sube una sola imagen a Cloudinary" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadSingle(@UploadedFile() file: any): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException("No se proporcionó ningún archivo");
    }

    return this.uploadService.uploadImage(file);
  }

  /**
   * Sube múltiples imágenes a Cloudinary
   */
  @Post("multiple")
  @ApiOperation({ summary: "Sube múltiples imágenes a Cloudinary (máximo 10)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("files", 10)) // Máximo 10 archivos
  async uploadMultiple(@UploadedFiles() files: any[]): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No se proporcionaron archivos");
    }

    return this.uploadService.uploadMultipleImages(files);
  }

  /**
   * Elimina una imagen de Cloudinary por su public_id
   */
  @Delete("single")
  @ApiOperation({ summary: "Elimina una imagen de Cloudinary" })
  async deleteImage(
    @Body("publicId") publicId: string,
  ): Promise<{ result: string }> {
    if (!publicId) {
      throw new BadRequestException("Se requiere el publicId de la imagen");
    }

    return this.uploadService.deleteImage(publicId);
  }

  /**
   * Elimina múltiples imágenes de Cloudinary
   */
  @Delete("multiple")
  @ApiOperation({ summary: "Elimina múltiples imágenes de Cloudinary" })
  async deleteMultipleImages(
    @Body("publicIds") publicIds: string[],
  ): Promise<{ deleted: string[] }> {
    if (!publicIds || publicIds.length === 0) {
      throw new BadRequestException(
        "Se requiere un array de publicIds de imágenes",
      );
    }

    return this.uploadService.deleteMultipleImages(publicIds);
  }
}
