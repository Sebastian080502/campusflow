import { HttpException, HttpStatus } from "@nestjs/common";
import { DomainError } from "../domain/request-policy";

export function rethrowDomain(error: unknown): never {
  if (error instanceof DomainError) {
    const status =
      error.code === "FORBIDDEN"
        ? HttpStatus.FORBIDDEN
        : error.code === "CONFLICT"
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;
    throw new HttpException(error.message, status);
  }
  throw error;
}
