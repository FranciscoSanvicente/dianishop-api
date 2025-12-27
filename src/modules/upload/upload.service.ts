import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

export interface ImageSize {
  width: number;
  height: number;
  url: string;
}

export interface UploadResult {
  original: {
    public_id: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  sizes: {
    small: ImageSize;
    medium: ImageSize;
    large: ImageSize;
    xlarge: ImageSize;
  };
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>("cloudinary.cloudName"),
      api_key: this.configService.get<string>("cloudinary.apiKey"),
      api_secret: this.configService.get<string>("cloudinary.apiSecret"),
    });

    this.logger.log("Cloudinary configurado correctamente");
  }

  /**
   * Sube una imagen a Cloudinary y genera múltiples tamaños optimizados
   */
  async uploadImage(file: any): Promise<UploadResult> {
    try {
      // Validar tipo de archivo
      if (!file.mimetype.startsWith("image/")) {
        throw new BadRequestException(
          "El archivo debe ser una imagen (jpg, png, gif, webp, etc.)",
        );
      }

      // Subir imagen original a Cloudinary
      const uploadResult = await this.uploadToCloudinary(file);

      // Generar URLs optimizadas para diferentes tamaños
      const sizes = this.generateImageSizes(uploadResult.public_id);

      return {
        original: {
          public_id: uploadResult.public_id,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
        sizes,
      };
    } catch (error) {
      this.logger.error("Error al subir imagen:", error);
      throw new BadRequestException(
        `Error al subir imagen: ${error.message || "Error desconocido"}`,
      );
    }
  }

  /**
   * Sube múltiples imágenes a Cloudinary
   */
  async uploadMultipleImages(files: any[]): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No se proporcionaron archivos");
    }

    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Sube un archivo a Cloudinary usando un stream
   */
  private uploadToCloudinary(file: any): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce", // Carpeta en Cloudinary
          resource_type: "auto",
          quality: "auto", // Optimización automática de calidad
          fetch_format: "auto", // Formato automático (WebP cuando sea posible)
        },
        (error, result) => {
          if (error) {
            this.logger.error("Error en upload_stream:", error);
            return reject(error);
          }
          resolve(result!);
        },
      );

      // Convertir buffer a stream y pipe a Cloudinary
      const readable = Readable.from(file.buffer);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Genera URLs optimizadas para diferentes tamaños de imagen
   */
  private generateImageSizes(public_id: string): {
    small: ImageSize;
    medium: ImageSize;
    large: ImageSize;
    xlarge: ImageSize;
  } {
    const sizes = [
      { name: "small", width: 150, height: 150 },
      { name: "medium", width: 400, height: 400 },
      { name: "large", width: 800, height: 800 },
      { name: "xlarge", width: 1200, height: 1200 },
    ];

    const result: any = {};

    sizes.forEach((size) => {
      result[size.name] = {
        width: size.width,
        height: size.height,
        url: cloudinary.url(public_id, {
          width: size.width,
          height: size.height,
          crop: "fill", // Recorta y rellena para mantener el aspect ratio
          gravity: "auto", // Enfoque automático en la parte más importante
          quality: "auto", // Calidad automática
          fetch_format: "auto", // Formato automático (WebP cuando sea posible)
        }),
      };
    });

    return result;
  }

  /**
   * Elimina una imagen de Cloudinary por su public_id
   */
  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Imagen eliminada: ${publicId}`);
      return result;
    } catch (error) {
      this.logger.error("Error al eliminar imagen:", error);
      throw new BadRequestException(
        `Error al eliminar imagen: ${error.message}`,
      );
    }
  }

  /**
   * Elimina múltiples imágenes de Cloudinary
   */
  async deleteMultipleImages(
    publicIds: string[],
  ): Promise<{ deleted: string[] }> {
    try {
      const deletePromises = publicIds.map((publicId) =>
        this.deleteImage(publicId),
      );
      await Promise.all(deletePromises);
      return { deleted: publicIds };
    } catch (error) {
      this.logger.error("Error al eliminar múltiples imágenes:", error);
      throw new BadRequestException(
        `Error al eliminar imágenes: ${error.message}`,
      );
    }
  }
}
