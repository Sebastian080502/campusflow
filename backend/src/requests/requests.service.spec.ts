import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Role } from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import { RequestsService } from "./requests.service";

describe("RequestsService", () => {
  const student = {
    id: "student-1",
    role: Role.USER,
    email: "estudiante@campusflow.local",
    fullName: "María Estudiante",
    active: true,
  };
  const staff = {
    id: "staff-1",
    role: Role.STAFF,
    email: "personal@campusflow.local",
    fullName: "Luis Encargado",
    active: true,
  };

  it("rejects request creation from staff", async () => {
    const service = new RequestsService({} as PrismaService);
    await expect(
      service.create(staff, {
        title: "Cambio de salón",
        description: "El salón asignado no tiene videobeam.",
        categoryId: "cat-1",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("rejects an inactive or missing category", async () => {
    const prisma = {
      category: { findFirst: () => Promise.resolve(null) },
    } as unknown as PrismaService;
    const service = new RequestsService(prisma);

    await expect(
      service.create(student, {
        title: "Cambio de salón",
        description: "El salón asignado no tiene videobeam.",
        categoryId: "missing",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
