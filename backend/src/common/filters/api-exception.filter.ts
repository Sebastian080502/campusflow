import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";

const UNIQUE_MESSAGE: Record<string, string> = {
  User: "Ya existe una cuenta con ese correo.",
  Category: "Ya existe una categoría con ese nombre.",
};

const MISSING_MESSAGE: Record<string, string> = {
  User: "Usuario no encontrado.",
  Category: "Categoría no encontrada.",
  Request: "Solicitud no encontrada.",
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === "string"
          ? body
          : ((body as { message?: string | string[] }).message ?? exception.message);

      response.status(status).json({
        statusCode: status,
        message,
        error: exception.name.replace(/Exception$/, ""),
      });
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = mapPrismaError(exception);
      if (mapped) {
        response.status(mapped.status).json({
          statusCode: mapped.status,
          message: mapped.message,
          error: mapped.error,
        });
        return;
      }
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor.",
      error: "Internal Server Error",
    });
  }
}

function mapPrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): { status: number; message: string; error: string } | null {
  const model = typeof error.meta?.modelName === "string" ? error.meta.modelName : undefined;
  if (error.code === "P2002") {
    return {
      status: HttpStatus.CONFLICT,
      message: (model && UNIQUE_MESSAGE[model]) || "Ya existe un registro con esos datos.",
      error: "Conflict",
    };
  }
  if (error.code === "P2025") {
    return {
      status: HttpStatus.NOT_FOUND,
      message: (model && MISSING_MESSAGE[model]) || "Registro no encontrado.",
      error: "Not Found",
    };
  }
  return null;
}
