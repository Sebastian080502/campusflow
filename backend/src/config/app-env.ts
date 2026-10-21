export interface AppEnv {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  appVersion: string;
  corsOrigin: string;
  appEnv: string;
  seedOnStart: boolean;
  exposeResetToken: boolean;
}

export function readAppEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const jwtSecret = source.JWT_SECRET ?? "";
  if (jwtSecret.length < 32) {
    throw new Error("JWT_SECRET debe definirse con al menos 32 caracteres.");
  }

  const databaseUrl = source.DATABASE_URL ?? "";
  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
    throw new Error("DATABASE_URL debe apuntar a PostgreSQL.");
  }

  const port = Number(source.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT debe ser un entero positivo.");
  }

  const appEnv = source.APP_ENV ?? source.NODE_ENV ?? "development";
  const exposeResetToken =
    source.EXPOSE_RESET_TOKEN === "true" ||
    (source.EXPOSE_RESET_TOKEN !== "false" && appEnv !== "production");

  return {
    port,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn: source.JWT_EXPIRES_IN?.trim() || "8h",
    appVersion: source.APP_VERSION?.trim() || "dev",
    corsOrigin: source.CORS_ORIGIN ?? "http://localhost:5173",
    appEnv,
    seedOnStart: source.SEED_ON_START === "true",
    exposeResetToken,
  };
}

export const APP_ENV = Symbol("APP_ENV");
