import { BadRequestException, Inject, Injectable } from "@nestjs/common";
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

  create(input: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: input.name,
        description: input.description || null,
      },
    });
  }

  async update(id: string, input: UpdateCategoryDto) {
    if (
      input.name === undefined &&
      input.description === undefined &&
      input.active === undefined
    ) {
      throw new BadRequestException("Indica al menos un cambio.");
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description === undefined ? undefined : input.description || null,
        active: input.active,
      },
    });
  }
}
