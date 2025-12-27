import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  FilterProductsDto,
  ProductSortBy,
  SortOrder,
} from "./dto/filter-products.dto";
import { ProductImagesService } from "./product-images.service";
import { Op } from "sequelize";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductWithImages {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
  sku?: string;
  categoryId: number;
  brandId: number;
  images: Array<{
    size: string;
    url: string;
  }>;
  createdAt?: any;
  updatedAt?: any;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    private readonly productImagesService: ProductImagesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductWithImages> {
    console.log("🚀 ~ ProductsService ~ create ~ dto:", createProductDto);

    // Filtrar valores undefined para evitar errores de NOT NULL
    const cleanData = {
      name: createProductDto.name,
      description: createProductDto.description || undefined,
      price: createProductDto.price,
      originalPrice: createProductDto.originalPrice || undefined,
      rating: createProductDto.rating || undefined,
      reviews: createProductDto.reviews || undefined,
      inStock:
        createProductDto.inStock !== undefined
          ? createProductDto.inStock
          : undefined,
      stock: createProductDto.stock || undefined,
      sku: createProductDto.sku || undefined,
      categoryId: createProductDto.categoryId,
      brandId: createProductDto.brandId,
    };
    console.log("🚀 ~ ProductsService ~ create ~ cleanData:", cleanData);

    const product = await this.productModel.create(cleanData);

    // Si hay imágenes, crearlas
    if (createProductDto.images && createProductDto.images.length > 0) {
      await this.productImagesService.createOrUpdateProductImages(product.id, {
        images: createProductDto.images,
      });
    }

    // Retornar el producto con las imágenes
    const productWithImages = await this.findOne(product.id);
    if (!productWithImages) {
      throw new Error("Error al obtener el producto creado");
    }
    return productWithImages;
  }

  async findAll(
    filterDto: FilterProductsDto,
  ): Promise<PaginatedResult<ProductWithImages>> {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      inStock,
      sortBy = ProductSortBy.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    if (brandId) {
      whereConditions.brandId = brandId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.price = {};
      if (minPrice !== undefined) {
        whereConditions.price[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        whereConditions.price[Op.lte] = maxPrice;
      }
    }

    if (inStock !== undefined) {
      whereConditions.inStock = inStock;
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación
    const { count, rows } = await this.productModel.findAndCountAll({
      where: whereConditions,
      include: [
        {
          association: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          association: "brand",
          attributes: ["id", "name"],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    // Agregar imágenes a cada producto
    const productsWithImages = await Promise.all(
      rows.map(async (product) => {
        try {
          const images = await this.productImagesService.findByProductId(
            product.id,
          );
          return {
            ...product.toJSON(),
            images: this.productImagesService.formatImagesForResponse(images),
          };
        } catch (error) {
          this.logger.warn(
            `Error al obtener imágenes para producto ${product.id}:`,
            error.message,
          );
          return {
            ...product.toJSON(),
            images: [],
          };
        }
      }),
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: productsWithImages,
      total: count,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductWithImages | null> {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          association: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          association: "brand",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return null;
    }

    // Agregar imágenes al producto
    try {
      const images = await this.productImagesService.findByProductId(id);
      return {
        ...product.toJSON(),
        images: this.productImagesService.formatImagesForResponse(images),
      };
    } catch (error) {
      this.logger.warn(
        `Error al obtener imágenes para producto ${id}:`,
        error.message,
      );
      return {
        ...product.toJSON(),
        images: [],
      };
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductWithImages | null> {
    console.log("🚀 ~ ProductsService ~ update ~ cleanData:", updateProductDto);

    // Filtrar valores undefined para evitar errores de NOT NULL
    const cleanData = {
      name: updateProductDto.name,
      description: updateProductDto.description || undefined,
      price: updateProductDto.price,
      originalPrice: updateProductDto.originalPrice || undefined,
      rating: updateProductDto.rating || undefined,
      reviews: updateProductDto.reviews || undefined,
      inStock:
        updateProductDto.inStock !== undefined
          ? updateProductDto.inStock
          : undefined,
      stock: updateProductDto.stock || undefined,
      sku: updateProductDto.sku || undefined,
      categoryId: updateProductDto.categoryId,
      brandId: updateProductDto.brandId,
    };

    // Actualizar el producto
    await this.productModel.update(cleanData, { where: { id } });

    // Manejar imágenes: si se envía el array (aunque esté vacío), actualizar/eliminar
    if (updateProductDto.images !== undefined) {
      if (updateProductDto.images.length > 0) {
        // Crear o actualizar imágenes
        await this.productImagesService.createOrUpdateProductImages(id, {
          images: updateProductDto.images,
        });
        this.logger.log(`Imágenes actualizadas para producto ${id}`);
      } else {
        // Array vacío: eliminar todas las imágenes del producto
        await this.productImagesService.deleteByProductId(id);
        this.logger.log(`Todas las imágenes eliminadas de producto ${id}`);
      }
    }

    // Retornar el producto actualizado con las imágenes
    const productWithImages = await this.findOne(id);
    if (!productWithImages) {
      throw new Error("Error al obtener el producto actualizado");
    }
    return productWithImages;
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      // Verificar si el producto existe antes de intentar eliminar
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      // Eliminar las imágenes del producto primero
      await this.productImagesService.deleteByProductId(id);

      // Eliminar el producto
      await this.productModel.destroy({ where: { id } });

      return {
        message: `Producto con ID ${id} eliminado exitosamente`,
      };
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ConflictException(
          "No se puede eliminar el producto porque tiene referencias activas en la base de datos (etiquetas, carrito o historial). Considera marcarlo como fuera de stock.",
        );
      }
      throw error;
    }
  }

  async updateStock(
    id: number,
    stock: number,
  ): Promise<ProductWithImages | null> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productModel.update(
      {
        stock,
        inStock: stock > 0,
      },
      { where: { id } },
    );

    return this.findOne(id);
  }

  async findProductsInStock(): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        inStock: true,
        stock: {
          [Op.gt]: 0,
        },
      },
      include: [
        {
          association: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          association: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.productModel.findAll({
      where: { categoryId },
      include: [
        {
          association: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          association: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findProductsByBrand(brandId: number): Promise<Product[]> {
    return this.productModel.findAll({
      where: { brandId },
      include: [
        {
          association: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          association: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
  }
}
