import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@ejemplo.com",
  })
  @IsEmail({}, { message: "Debe proporcionar un email válido" })
  @IsNotEmpty({ message: "El email es obligatorio" })
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "password123",
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;

  @ApiProperty({
    description: "Nombre completo del usuario",
    example: "Juan Pérez",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "El nombre completo debe ser una cadena de texto" })
  full_name?: string;

  @ApiProperty({
    description: "Número de teléfono del usuario",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "El teléfono debe ser una cadena de texto" })
  phone?: string;
}
