export interface AppEnv {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  corsOrigin: string;
  appEnv: string;
  seedOnStart: boolean;
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

  return {
    port,
    databaseUrl,
    jwtSecret,
    corsOrigin: source.CORS_ORIGIN ?? "http://localhost:5173",
    appEnv: source.APP_ENV ?? source.NODE_ENV ?? "development",
    seedOnStart: source.SEED_ON_START === "true",
  };
}

export const APP_ENV = Symbol("APP_ENV");
