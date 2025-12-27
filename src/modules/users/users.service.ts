import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Users } from "./entities/users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FilterUsersDto, UserSortBy, SortOrder } from "./dto/filter-users.dto";
import { Op } from "sequelize";
import * as bcrypt from "bcrypt";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
  ) {}

  async create(dto: CreateUserDto): Promise<Users> {
    // Verificar si el email ya existe
    const existingUser = await this.usersModel.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("El email ya está registrado");
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersModel.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async findAll(filterDto: FilterUsersDto): Promise<PaginatedResult<Users>> {
    const {
      page = 1,
      limit = 20,
      email,
      full_name,
      sortBy = UserSortBy.ID,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (email) {
      whereConditions.email = {
        [Op.iLike]: `%${email}%`,
      };
    }

    if (full_name) {
      whereConditions.full_name = {
        [Op.iLike]: `%${full_name}%`,
      };
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación
    const { count, rows } = await this.usersModel.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      attributes: { exclude: ["password"] }, // Excluir contraseña de los resultados
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

  async findOne(id: number): Promise<Users | null> {
    const user = await this.usersModel.findByPk(id, {
      attributes: { exclude: ["password"] }, // Excluir contraseña
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<Users> {
    const user = await this.usersModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se está actualizando el email, verificar que no exista
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.usersModel.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException("El email ya está registrado");
      }
    }

    // Si se está actualizando la contraseña, encriptarla
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.usersModel.update(dto, { where: { id } });

    const updatedUser = await this.findOne(id);
    return updatedUser!; // Ya verificamos que existe arriba
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const user = await this.usersModel.findByPk(id);

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      await this.usersModel.destroy({ where: { id } });

      return { message: `Usuario con ID ${id} eliminado exitosamente` };
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new ConflictException(
          "No se puede eliminar el usuario porque tiene órdenes asociadas. Debes eliminar primero sus órdenes o anonimizar al usuario.",
        );
      }
      throw error;
    }
  }
}
