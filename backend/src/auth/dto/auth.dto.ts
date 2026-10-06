import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
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
}

export class LoginDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: "Ingresa un correo válido." })
  email!: string;

  @IsString()
  @MinLength(1, { message: "Ingresa la contraseña." })
  password!: string;
}
