import { INestApplication, ValidationPipe, BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import helmet from "helmet";
import { AppEnv } from "./config/app-env";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

function flattenValidation(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const own = error.constraints ? Object.values(error.constraints) : [];
    const nested = error.children?.length ? flattenValidation(error.children) : [];
    return [...own, ...nested];
  });
}

export function configureApp(app: INestApplication, env: AppEnv): void {
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.enableCors({
    origin: env.corsOrigin
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(flattenValidation(errors)),
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());
}
