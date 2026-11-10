import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../../domain/request-policy";

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres." })
  @MaxLength(120, { message: "El nombre no puede superar 120 caracteres." })
  fullName?: string;

  @IsOptional()
  @IsEnum(Role, { message: "El rol no es válido." })
  role?: Role;

  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser verdadero o falso." })
  active?: boolean;
}
