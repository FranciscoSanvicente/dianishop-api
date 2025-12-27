import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SizeImages } from "./entities/size-images.entity";

@Injectable()
export class SizeImagesService {
  private readonly logger = new Logger(SizeImagesService.name);

  constructor(
    @InjectModel(SizeImages)
    private readonly sizeImagesModel: typeof SizeImages,
  ) {}

  /**
   * Obtiene todos los tamaños de imagen disponibles
   */
  async findAll(): Promise<SizeImages[]> {
    return this.sizeImagesModel.findAll({
      order: [["id", "ASC"]],
    });
  }

  /**
   * Obtiene un tamaño por ID
   */
  async findOne(id: number): Promise<SizeImages | null> {
    return this.sizeImagesModel.findByPk(id);
  }

  /**
   * Obtiene un tamaño por el valor del size (ej: "150x150")
   */
  async findBySize(size: string): Promise<SizeImages | null> {
    return this.sizeImagesModel.findOne({
      where: { size },
    });
  }

  /**
   * Crea un nuevo tamaño de imagen
   */
  async create(size: string): Promise<SizeImages> {
    return this.sizeImagesModel.create({ size });
  }

  /**
   * Inicializa los tamaños predeterminados si no existen
   */
  async initializeDefaultSizes(): Promise<void> {
    const defaultSizes = [
      "150x150",
      "400x400",
      "800x800",
      "1200x1200",
      "original",
    ];

    for (const size of defaultSizes) {
      const existingSize = await this.findBySize(size);
      if (!existingSize) {
        await this.create(size);
        this.logger.log(`Tamaño ${size} creado`);
      }
    }
  }
}
