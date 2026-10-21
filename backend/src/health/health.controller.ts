import { Controller, Get, Inject, Logger, ServiceUnavailableException } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { APP_ENV, AppEnv } from "../config/app-env";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  @Public()
  @Get()
  async get() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      this.logger.error("La comprobación de salud no pudo consultar la base.");
      throw new ServiceUnavailableException("La base de datos no responde.");
    }
    return { status: "ok", db: "ok", version: this.env.appVersion };
  }
}
