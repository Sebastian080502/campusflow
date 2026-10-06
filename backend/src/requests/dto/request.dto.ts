import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { RequestStatus } from "../../domain/request-policy";

export class CreateRequestDto {
  @IsString()
  @MinLength(5, { message: "El título debe tener al menos 5 caracteres." })
  @MaxLength(120, { message: "El título no puede superar 120 caracteres." })
  title!: string;

  @IsString()
  @MinLength(10, { message: "La descripción debe tener al menos 10 caracteres." })
  @MaxLength(4000, { message: "La descripción no puede superar 4000 caracteres." })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: "Selecciona una categoría." })
  categoryId!: string;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus, { message: "El estado no es válido." })
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "El responsable no es válido." })
  assigneeId?: string;
}

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: "Escribe un comentario." })
  @MaxLength(1000, { message: "El comentario no puede superar 1000 caracteres." })
  body!: string;
}

export class ListRequestsQuery {
  @IsOptional()
  @IsEnum(RequestStatus, { message: "El estado no es válido." })
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
