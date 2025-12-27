import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService, PaginatedResult } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FilterUsersDto } from "./dto/filter-users.dto";
import { Users } from "./entities/users.entity";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: "Obtener usuarios con filtros, ordenamiento y paginación",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios obtenida exitosamente",
  })
  findAll(@Query() filterDto: FilterUsersDto): Promise<PaginatedResult<Users>> {
    return this.usersService.findAll(filterDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiResponse({ status: 200, description: "Usuario encontrado" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario actualizado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario eliminado exitosamente" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
