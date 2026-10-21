import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { INestApplication, ValidationPipe, BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
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
  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
        },
      },
    }),
  );
  mountApiDocs(app);
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

function mountApiDocs(app: INestApplication): void {
  const specPath = [
    resolve(__dirname, "../../../docs/07-api/contracts/openapi/campusflow.yaml"),
    resolve(process.cwd(), "../docs/07-api/contracts/openapi/campusflow.yaml"),
    resolve(process.cwd(), "docs/07-api/contracts/openapi/campusflow.yaml"),
  ].find((candidate) => existsSync(candidate));
  if (!specPath) {
    return;
  }
  const document = parse(readFileSync(specPath, "utf8")) as object;
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document, { customSiteTitle: "CampusFlow API" }));
}
