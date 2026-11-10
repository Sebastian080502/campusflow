import { HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { ApiExceptionFilter } from "../src/common/filters/api-exception.filter";

function capture() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  };
  return { host, status, json };
}

describe("ApiExceptionFilter prisma codes", () => {
  it("maps a repeated category to 409", () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = capture();
    filter.catch(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "test",
        meta: { modelName: "Category" },
      }),
      host as never,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Ya existe una categoría con ese nombre." }),
    );
  });

  it("maps a missing category to 404", () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = capture();
    filter.catch(
      new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "test",
        meta: { modelName: "Category" },
      }),
      host as never,
    );
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Categoría no encontrada." }),
    );
  });
});
