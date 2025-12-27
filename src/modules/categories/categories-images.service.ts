import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CategoriesImages } from "./entities/categories-images.entity";
import { SizeImages } from "../upload/entities/size-images.entity";
import {
  CategoryImageDto,
  CreateCategoryImagesDto,
} from "./dto/category-image.dto";

@Injectable()
export class CategoriesImagesService {
  private readonly logger = new Logger(CategoriesImagesService.name);

  constructor(
    @InjectModel(CategoriesImages)
    private readonly categoriesImagesModel: typeof CategoriesImages,
    @InjectModel(SizeImages)
    private readonly sizeImagesModel: typeof SizeImages,
  ) {}

  /**
   * Obtiene todas las imágenes de una categoría
   */
  async findByCategoryId(categoryId: number): Promise<CategoriesImages[]> {
    console.log("🚀 ~ findByCategoryId ~ categoryId:", categoryId);

    const result = await this.categoriesImagesModel.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: SizeImages,
          as: "size",
          attributes: ["id", "size"],
          required: false, // LEFT JOIN en lugar de INNER JOIN
        },
      ],
      order: [["size_id", "ASC"]],
    });

    console.log("🚀 ~ findByCategoryId ~ result count:", result.length);
    if (result.length > 0) {
      console.log("🚀 ~ findByCategoryId ~ first result:", result[0].toJSON());
    }

    return result;
  }

  /**
   * Obtiene una imagen específica de una categoría por tamaño
   */
  async findByCategoryAndSize(
    categoryId: number,
    sizeId: number,
  ): Promise<CategoriesImages | null> {
    return this.categoriesImagesModel.findOne({
      where: {
        category_id: categoryId,
        size_id: sizeId,
      },
      include: [
        {
          model: SizeImages,
          as: "size",
          attributes: ["id", "size"],
        },
      ],
    });
  }

  /**
   * Crea o actualiza las imágenes de una categoría
   */
  async createOrUpdateCategoryImages(
    categoryId: number,
    imagesDto: CreateCategoryImagesDto,
  ): Promise<CategoriesImages[]> {
    // Primero, eliminar todas las imágenes existentes de la categoría
    await this.deleteByCategoryId(categoryId);

    const createdImages: CategoriesImages[] = [];

    // Crear las nuevas imágenes
    for (const imageDto of imagesDto.images) {
      // Buscar el size_id por el tamaño
      const sizeImage = await this.sizeImagesModel.findOne({
        where: { size: imageDto.size },
      });

      if (!sizeImage) {
        this.logger.warn(`Tamaño ${imageDto.size} no encontrado`);
        continue;
      }

      // Crear la imagen
      const categoryImage = await this.categoriesImagesModel.create({
        category_id: categoryId,
        size_id: sizeImage.id,
        url: imageDto.url,
        public_id: imageDto.public_id,
      });

      createdImages.push(categoryImage);
    }

    this.logger.log(
      `Imágenes creadas/actualizadas para categoría ${categoryId}`,
    );

    // Retornar las imágenes con la información del tamaño
    return this.findByCategoryId(categoryId);
  }

  /**
   * Elimina todas las imágenes de una categoría
   */
  async deleteByCategoryId(categoryId: number): Promise<{ message: string }> {
    const deletedCount = await this.categoriesImagesModel.destroy({
      where: { category_id: categoryId },
    });

    this.logger.log(
      `${deletedCount} imágenes eliminadas de categoría ${categoryId}`,
    );

    return {
      message: `${deletedCount} imágenes eliminadas de la categoría`,
    };
  }

  /**
   * Elimina una imagen específica de una categoría
   */
  async deleteCategoryImage(
    categoryId: number,
    sizeId: number,
  ): Promise<{ message: string }> {
    const deletedCount = await this.categoriesImagesModel.destroy({
      where: {
        category_id: categoryId,
        size_id: sizeId,
      },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(
        `Imagen no encontrada para categoría ${categoryId} y tamaño ${sizeId}`,
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
  getCategoriesImagesModel() {
    return this.categoriesImagesModel;
  }

  getSizeImagesModel() {
    return this.sizeImagesModel;
  }

  /**
   * Formatea las imágenes para respuesta de API
   */
  formatImagesForResponse(categoryImages: CategoriesImages[]): any[] {
    console.log(
      "🚀 ~ formatImagesForResponse ~ categoryImages count:",
      categoryImages.length,
    );

    return categoryImages.map((img, index) => {
      console.log(
        `🚀 ~ formatImagesForResponse ~ Processing image ${index + 1}:`,
      );

      // Obtener el JSON completo para ver todos los datos
      const imgData = img.toJSON();
      console.log("  - imgData completo:", imgData);

      // Usar los datos del JSON para asegurar que tenemos acceso a todas las propiedades
      const urlFromData = imgData.url || img.url;
      const sizeIdFromData = imgData.size_id || img.size_id;

      console.log("  - urlFromData:", urlFromData);
      console.log("  - sizeIdFromData:", sizeIdFromData);

      // Si img.size no está cargado, intentar obtenerlo por size_id
      let sizeValue = "";
      if (imgData.size && imgData.size.size) {
        sizeValue = imgData.size.size;
        console.log("  - size from imgData.size:", sizeValue);
      } else {
        // Último fallback: mapear por ID conocido
        const sizeMap: { [key: number]: string } = {
          1: "150x150",
          2: "400x400",
          3: "800x800",
          4: "1200x1200",
          5: "original",
        };
        sizeValue = sizeMap[sizeIdFromData] || `size_${sizeIdFromData}`;
        console.log("  - size from mapping:", sizeValue);
      }

      const result = {
        size: sizeValue,
        url: urlFromData, // Usar la URL del JSON data
      };

      console.log(`  - Final result for image ${index + 1}:`, result);
      return result;
    });
  }
}
