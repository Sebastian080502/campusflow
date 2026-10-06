import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuthenticatedUser, Role } from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoriesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list(actor: AuthenticatedUser) {
    return this.prisma.category.findMany({
      where: actor.role === Role.ADMIN ? undefined : { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(input: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: input.name,
          description: input.description || null,
        },
      });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, input: UpdateCategoryDto) {
    if (
      input.name === undefined &&
      input.description === undefined &&
      input.active === undefined
    ) {
      throw new BadRequestException("Indica al menos un cambio.");
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description === undefined ? undefined : input.description || null,
          active: input.active,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundException("Categoría no encontrada.");
      }
      this.rethrowUnique(error);
    }
  }

  private rethrowUnique(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Ya existe una categoría con ese nombre.");
    }
    throw error;
  }
}
