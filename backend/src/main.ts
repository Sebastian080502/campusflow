import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { readAppEnv } from "./config/app-env";
import { configureApp } from "./configure-app";
import { PrismaService } from "./prisma/prisma.service";
import { seed } from "./seed";

if (process.env.NODE_ENV !== "production") {
  loadEnv({ path: resolve(__dirname, "..", "..", ".env") });
}

async function bootstrap(): Promise<void> {
  const env = readAppEnv();
  const app = await NestFactory.create(AppModule);
  configureApp(app, env);
  app.enableShutdownHooks();
  if (env.seedOnStart) {
    await seed(app.get(PrismaService));
  }
  await app.listen(env.port);
  console.log(`CampusFlow API listening on port ${env.port} (${env.appEnv}).`);
}

bootstrap().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
