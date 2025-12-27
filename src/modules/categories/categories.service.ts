import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import {
  FilterCategoriesDto,
  CategorySortBy,
  SortOrder,
} from "./dto/filter-categories.dto";
import { CategoriesImagesService } from "./categories-images.service";
import { Op } from "sequelize";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryWithImages {
  id: number;
  name: string;
  slug: string;
  image: string;
  images: Array<{
    size: string;
    url: string;
  }>;
  createdAt?: any;
  updatedAt?: any;
  deletedAt?: any;
  version?: any;
}

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel(Category) private categoryModel: typeof Category,
    private readonly categoriesImagesService: CategoriesImagesService,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryWithImages> {
    console.log("🚀 ~ CategoriesService ~ create ~ dto:", dto);

    // Filtrar valores undefined para evitar errores de NOT NULL
    const cleanData = {
      name: dto.name,
      slug: dto.slug || undefined,
      image: dto.image || undefined,
    };
    console.log("🚀 ~ CategoriesService ~ create ~ cleanData:", cleanData);

    const category = await this.categoryModel.create(cleanData);

    // Si hay imágenes, crearlas
    if (dto.images && dto.images.length > 0) {
      await this.categoriesImagesService.createOrUpdateCategoryImages(
        category.id,
        { images: dto.images },
      );
    }

    // Retornar la categoría con las imágenes
    const categoryWithImages = await this.findOne(category.id);
    if (!categoryWithImages) {
      throw new Error("Error al obtener la categoría creada");
    }
    return categoryWithImages;
  }

  async findAll(
    filterDto: FilterCategoriesDto,
  ): Promise<PaginatedResult<CategoryWithImages>> {
    const {
      page = 1,
      limit = 20,
      name,
      slug,
      sortBy = CategorySortBy.NAME,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (name) {
      whereConditions.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (slug) {
      whereConditions.slug = {
        [Op.iLike]: `%${slug}%`,
      };
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación
    const { count, rows } = await this.categoryModel.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    // Agregar imágenes a cada categoría
    const categoriesWithImages = await Promise.all(
      rows.map(async (category) => {
        try {
          const images = await this.categoriesImagesService.findByCategoryId(
            category.id,
          );
          return {
            ...category.toJSON(),
            images:
              this.categoriesImagesService.formatImagesForResponse(images),
          };
        } catch (error) {
          this.logger.warn(
            `Error al obtener imágenes para categoría ${category.id}:`,
            error.message,
          );
          return {
            ...category.toJSON(),
            images: [],
          };
        }
      }),
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: categoriesWithImages,
      total: count,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<CategoryWithImages | null> {
    const category = await this.categoryModel.findByPk(id);

    if (!category) {
      return null;
    }

    // Agregar imágenes a la categoría
    try {
      const images = await this.categoriesImagesService.findByCategoryId(id);
      console.log("🚀 ~ CategoriesService ~ findOne ~ images:", images);
      return {
        ...category.toJSON(),
        images: this.categoriesImagesService.formatImagesForResponse(images),
      };
    } catch (error) {
      this.logger.warn(
        `Error al obtener imágenes para categoría ${id}:`,
        error.message,
      );
      return {
        ...category.toJSON(),
        images: [],
      };
    }
  }

  async update(
    id: number,
    dto: CreateCategoryDto,
  ): Promise<CategoryWithImages | null> {
    // Filtrar valores undefined para evitar errores de NOT NULL
    const cleanData = {
      name: dto.name,
      slug: dto.slug || undefined,
      image: dto.image || undefined,
    };

    console.log("🚀 ~ CategoriesService ~ update ~ cleanData:", cleanData);

    // Actualizar la categoría
    await this.categoryModel.update(cleanData, { where: { id } });

    // Manejar imágenes: si se envía el array (aunque esté vacío), actualizar/eliminar
    if (dto.images !== undefined) {
      if (dto.images.length > 0) {
        // Crear o actualizar imágenes
        await this.categoriesImagesService.createOrUpdateCategoryImages(id, {
          images: dto.images,
        });
        this.logger.log(`Imágenes actualizadas para categoría ${id}`);
      } else {
        // Array vacío: eliminar todas las imágenes de la categoría
        await this.categoriesImagesService.deleteByCategoryId(id);
        this.logger.log(`Todas las imágenes eliminadas de categoría ${id}`);
      }
    }

    // Retornar la categoría actualizada con las imágenes
    const categoryWithImages = await this.findOne(id);
    if (!categoryWithImages) {
      throw new Error("Error al obtener la categoría actualizada");
    }
    return categoryWithImages;
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const category = await this.findOne(id);
      if (!category) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      // Eliminar las imágenes de la categoría primero
      await this.categoriesImagesService.deleteByCategoryId(id);

      // Eliminar la categoría
      await this.categoryModel.destroy({ where: { id } });

      return {
        message: `Categoría con ID ${id} eliminada exitosamente`,
      };
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ConflictException(
          "No se puede eliminar la categoría porque tiene productos asociados. Elimina primero los productos o cámbialos de categoría.",
        );
      }
      throw error;
    }
  }

  // Métodos públicos para debug
  getCategoryModel() {
    return this.categoryModel;
  }

  getCategoriesImagesService() {
    return this.categoriesImagesService;
  }

  // Método de debug para investigar el problema
  async debugCategoryImages(id: number) {
    try {
      this.logger.log(`🔍 Debugging category ${id}...`);

      // 1. Verificar si la categoría existe
      const category = await this.categoryModel.findByPk(id);
      this.logger.log(`📋 Category exists: ${!!category}`);

      if (!category) {
        return { error: "Category not found" };
      }

      // 2. Verificar si hay imágenes en la tabla directamente
      const directImages = await this.categoriesImagesService
        .getCategoriesImagesModel()
        .findAll({
          where: { category_id: id },
          raw: true,
        });
      this.logger.log(`📋 Direct images found: ${directImages.length}`);
      this.logger.log(`📋 Direct images:`, directImages);

      // 3. Verificar si hay tamaños disponibles
      const sizes = await this.categoriesImagesService
        .getSizeImagesModel()
        .findAll({
          raw: true,
        });
      this.logger.log(`📋 Available sizes: ${sizes.length}`);
      this.logger.log(`📋 Sizes:`, sizes);

      // 4. Intentar la consulta con include
      const imagesWithInclude = await this.categoriesImagesService
        .getCategoriesImagesModel()
        .findAll({
          where: { category_id: id },
          include: [
            {
              model: this.categoriesImagesService.getSizeImagesModel(),
              as: "size",
              attributes: ["id", "size"],
            },
          ],
        });
      this.logger.log(`📋 Images with include: ${imagesWithInclude.length}`);
      this.logger.log(
        `📋 Images with include:`,
        imagesWithInclude.map((img) => img.toJSON()),
      );

      // 5. Probar el método formatImagesForResponse
      const formattedImages =
        this.categoriesImagesService.formatImagesForResponse(imagesWithInclude);
      this.logger.log(`📋 Formatted images: ${formattedImages.length}`);
      this.logger.log(`📋 Formatted images:`, formattedImages);

      return {
        category: category.toJSON(),
        directImages,
        sizes,
        imagesWithInclude: imagesWithInclude.map((img) => img.toJSON()),
        formattedImages,
        debug: {
          categoryExists: !!category,
          directImagesCount: directImages.length,
          sizesCount: sizes.length,
          imagesWithIncludeCount: imagesWithInclude.length,
          formattedImagesCount: formattedImages.length,
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error in debug:`, error.message);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  // Método temporal para diagnosticar problemas
  async findAllWithoutImages(
    filterDto: FilterCategoriesDto,
  ): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      name,
      slug,
      sortBy = CategorySortBy.NAME,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (name) {
      whereConditions.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (slug) {
      whereConditions.slug = {
        [Op.iLike]: `%${slug}%`,
      };
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación SIN imágenes
    const { count, rows } = await this.categoryModel.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows.map((category) => category.toJSON()),
      total: count,
      page,
      limit,
      totalPages,
    };
  }
}
