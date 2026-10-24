import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(3, { message: "El nombre de la categoría debe tener al menos 3 caracteres." })
  @MaxLength(80, { message: "El nombre de la categoría no puede superar 80 caracteres." })
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(500, { message: "La descripción no puede superar 500 caracteres." })
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(3, { message: "El nombre de la categoría debe tener al menos 3 caracteres." })
  @MaxLength(80, { message: "El nombre de la categoría no puede superar 80 caracteres." })
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(500, { message: "La descripción no puede superar 500 caracteres." })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser verdadero o falso." })
  active?: boolean;
}
