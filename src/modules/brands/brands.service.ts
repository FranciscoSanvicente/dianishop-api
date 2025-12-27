// src/modules/brands/brands.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Brand } from "./entities/brand.entity";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import {
  FilterBrandsDto,
  BrandSortBy,
  SortOrder,
} from "./dto/filter-brands.dto";
import { Op } from "sequelize";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand)
    private readonly brandModel: typeof Brand,
  ) {}

  create(dto: CreateBrandDto): Promise<Brand> {
    return this.brandModel.create(dto);
  }

  async findAll(filterDto: FilterBrandsDto): Promise<PaginatedResult<Brand>> {
    const {
      page = 1,
      limit = 20,
      name,
      sortBy = BrandSortBy.NAME,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (name) {
      whereConditions.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación
    const { count, rows } = await this.brandModel.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages,
    };
  }

  findOne(id: number): Promise<Brand | null> {
    return this.brandModel.findByPk(id);
  }

  async update(id: number, dto: UpdateBrandDto): Promise<[affected: number]> {
    return this.brandModel.update(dto, { where: { id } });
  }

  async remove(id: number): Promise<number> {
    try {
      const brand = await this.findOne(id);
      if (!brand) {
        throw new NotFoundException(`Marca con ID ${id} no encontrada`);
      }

      return await this.brandModel.destroy({ where: { id } });
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ConflictException(
          "No se puede eliminar la marca porque tiene productos asociados. Elimina primero los productos o cámbialos de marca.",
        );
      }
      throw error;
    }
  }
}
