import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ProductImages } from "./entities/product-images.entity";
import { SizeImages } from "../upload/entities/size-images.entity";
import {
  ProductImageDto,
  CreateProductImagesDto,
} from "./dto/product-image.dto";

@Injectable()
export class ProductImagesService {
  private readonly logger = new Logger(ProductImagesService.name);

  constructor(
    @InjectModel(ProductImages)
    private readonly productImagesModel: typeof ProductImages,
    @InjectModel(SizeImages)
    private readonly sizeImagesModel: typeof SizeImages,
  ) {}

  /**
   * Obtiene todas las imágenes de un producto
   */
  async findByProductId(productId: number): Promise<ProductImages[]> {
    console.log("🚀 ~ findByProductId ~ productId:", productId);

    const result = await this.productImagesModel.findAll({
      where: { product_id: productId },
      order: [["size_id", "ASC"]],
    });

    console.log("🚀 ~ findByProductId ~ result count:", result.length);
    if (result.length > 0) {
      console.log("🚀 ~ findByProductId ~ first result:", result[0].toJSON());
    }

    return result;
  }

  /**
   * Obtiene una imagen específica de un producto por tamaño
   */
  async findByProductAndSize(
    productId: number,
    sizeId: string,
  ): Promise<ProductImages | null> {
    return this.productImagesModel.findOne({
      where: {
        product_id: productId,
        size_id: sizeId,
      },
    });
  }

  /**
   * Crea o actualiza las imágenes de un producto
   */
  async createOrUpdateProductImages(
    productId: number,
    imagesDto: CreateProductImagesDto,
  ): Promise<ProductImages[]> {
    // Primero, eliminar todas las imágenes existentes del producto
    await this.deleteByProductId(productId);

    const createdImages: ProductImages[] = [];

    // Contador para generar size_id únicos cuando hay múltiples imágenes del mismo tamaño
    const sizeCounter: { [key: string]: number } = {};

    // Crear las nuevas imágenes
    for (const imageDto of imagesDto.images) {
      console.log(
        `🚀 ~ createOrUpdateProductImages ~ Processing size: ${imageDto.size}`,
      );

      // Verificar que el tamaño existe en la tabla size_images
      const sizeImage = await this.sizeImagesModel.findOne({
        where: { size: imageDto.size },
      });

      console.log(
        `🚀 ~ createOrUpdateProductImages ~ sizeImage found:`,
        sizeImage?.toJSON(),
      );

      if (!sizeImage) {
        this.logger.warn(`Tamaño ${imageDto.size} no encontrado`);
        continue;
      }

      // Generar un size_id único para cada imagen
      // Si hay múltiples imágenes del mismo tamaño, agregar un sufijo numérico
      if (!sizeCounter[imageDto.size]) {
        sizeCounter[imageDto.size] = 0;
      }
      sizeCounter[imageDto.size]++;

      // Para la primera imagen de cada tamaño, usar solo el tamaño
      // Para las siguientes, agregar un sufijo: "150x150_2", "150x150_3", etc.
      const sizeId =
        sizeCounter[imageDto.size] === 1
          ? imageDto.size
          : `${imageDto.size}_${sizeCounter[imageDto.size]}`;

      console.log(`🚀 ~ createOrUpdateProductImages ~ sizeId: ${sizeId}`);

      const productImage = await this.productImagesModel.create({
        product_id: productId,
        url: imageDto.url,
        size_id: sizeId, // Usar el tamaño con sufijo para garantizar unicidad
        public_id: imageDto.public_id,
      });

      createdImages.push(productImage);
    }

    this.logger.log(`Imágenes creadas/actualizadas para producto ${productId}`);

    // Retornar las imágenes con la información del tamaño
    return this.findByProductId(productId);
  }

  /**
   * Elimina todas las imágenes de un producto (incluyendo de Cloudinary)
   */
  async deleteByProductId(productId: number): Promise<{ message: string }> {
    // Obtener las imágenes antes de eliminarlas para obtener los public_ids
    const images = await this.productImagesModel.findAll({
      where: { product_id: productId },
      attributes: ["public_id"],
    });

    // Eliminar de la base de datos
    const deletedCount = await this.productImagesModel.destroy({
      where: { product_id: productId },
    });

    this.logger.log(
      `${deletedCount} imágenes eliminadas de producto ${productId}`,
    );

    // TODO: Implementar eliminación de Cloudinary usando los public_ids
    // await this.deleteFromCloudinary(images.map(img => img.public_id));

    return {
      message: `${deletedCount} imágenes eliminadas del producto`,
    };
  }

  /**
   * Elimina una imagen específica de un producto
   */
  async deleteProductImage(
    productId: number,
    sizeId: string,
  ): Promise<{ message: string }> {
    const deletedCount = await this.productImagesModel.destroy({
      where: {
        product_id: productId,
        size_id: sizeId,
      },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(
        `Imagen no encontrada para producto ${productId} y tamaño ${sizeId}`,
      );
    }

    return {
      message: "Imagen eliminada exitosamente",
    };
  }

  /**
   * Obtiene todos los tamaños de imagen (método para debug)
   */
  async findAll(): Promise<SizeImages[]> {
    return this.sizeImagesModel.findAll({
      order: [["id", "ASC"]],
    });
  }

  // Métodos públicos para debug
  getProductImagesModel() {
    return this.productImagesModel;
  }

  getSizeImagesModel() {
    return this.sizeImagesModel;
  }

  /**
   * Formatea las imágenes para respuesta de API
   */
  formatImagesForResponse(productImages: ProductImages[]): any[] {
    console.log(
      "🚀 ~ formatImagesForResponse ~ productImages count:",
      productImages.length,
    );

    return productImages.map((img, index) => {
      console.log(
        `🚀 ~ formatImagesForResponse ~ Processing image ${index + 1}:`,
      );

      // Obtener el JSON completo para ver todos los datos
      const imgData = img.toJSON();
      console.log("  - imgData completo:", imgData);

      // Usar los datos del JSON para asegurar que tenemos acceso a todas las propiedades
      const urlFromData = imgData.url || img.url;
      const sizeIdFromData = imgData.size_id || img.size_id;
      const publicIdFromData = imgData.public_id || img.public_id;

      console.log("  - urlFromData:", urlFromData);
      console.log("  - sizeIdFromData:", sizeIdFromData);
      console.log("  - publicIdFromData:", publicIdFromData);

      // Extraer el tamaño real del size_id
      // Si es "150x150" -> devolver "150x150"
      // Si es "150x150_2" -> devolver "150x150"
      // Si es "150x150_3" -> devolver "150x150"
      let sizeValue = sizeIdFromData || "unknown";
      if (sizeValue.includes("_")) {
        // Eliminar el sufijo numérico
        sizeValue = sizeValue.split("_")[0];
      }
      console.log("  - size from size_id:", sizeValue);

      const result = {
        size: sizeValue,
        url: urlFromData, // Usar la URL del JSON data
        public_id: publicIdFromData,
      };

      console.log(`  - Final result for image ${index + 1}:`, result);
      return result;
    });
  }
}
