import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../../domain/request-policy";

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres." })
  @MaxLength(120, { message: "El nombre no puede superar 120 caracteres." })
  fullName!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: "Ingresa un correo válido." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  @MaxLength(72, { message: "La contraseña no puede superar 72 caracteres." })
  password!: string;

  @IsEnum(Role, { message: "El rol no es válido." })
  role!: Role;
}
