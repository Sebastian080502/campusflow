import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, Role as PrismaRole } from "@prisma/client";
import { AuthenticatedUser, Role } from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hashPassword } from "./password";
import { AssigneeOption, PublicUser, toAssigneeOption, toPublicUser } from "./user.presenter";

const publicSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  active: true,
} as const;

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByEmailWithSecret(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findActiveById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicSelect,
    });
    if (!user?.active) {
      return null;
    }
    return toPublicUser(user);
  }

  async list(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({
      select: publicSelect,
      orderBy: { fullName: "asc" },
    });
    return users.map(toPublicUser);
  }

  async listAssignees(): Promise<AssigneeOption[]> {
    const users = await this.prisma.user.findMany({
      where: { active: true, role: { in: [PrismaRole.STAFF, PrismaRole.ADMIN] } },
      select: { id: true, fullName: true, role: true },
      orderBy: { fullName: "asc" },
    });
    return users.map(toAssigneeOption);
  }

  async create(input: CreateUserDto): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          passwordHash: await hashPassword(input.password),
          role: input.role as PrismaRole,
        },
        select: publicSelect,
      });
      return toPublicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Ya existe una cuenta con ese correo.");
      }
      throw error;
    }
  }

  async update(actor: AuthenticatedUser, id: string, input: UpdateUserDto): Promise<PublicUser> {
    if (input.fullName === undefined && input.role === undefined && input.active === undefined) {
      throw new BadRequestException("Indica al menos un cambio.");
    }

    const current = await this.prisma.user.findUnique({ where: { id }, select: publicSelect });
    if (!current) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    if (actor.id === id && (input.active === false || (input.role && input.role !== Role.ADMIN))) {
      throw new BadRequestException("No puedes quitarte el acceso de administrador.");
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: input.fullName,
        role: input.role as PrismaRole | undefined,
        active: input.active,
      },
      select: publicSelect,
    });
    return toPublicUser(user);
  }
}
