import { ServiceUnavailableException } from "@nestjs/common";
import { HealthController } from "../src/health/health.controller";

describe("HealthController", () => {
  it("returns the database status and the version", async () => {
    const prisma = { $queryRaw: () => Promise.resolve([1]) };
    const controller = new HealthController(prisma as never, { appVersion: "abc1234" } as never);
    await expect(controller.get()).resolves.toEqual({
      status: "ok",
      db: "ok",
      version: "abc1234",
    });
  });

  it("answers 503 when the database query fails", async () => {
    const prisma = { $queryRaw: () => Promise.reject(new Error("down")) };
    const controller = new HealthController(prisma as never, { appVersion: "abc1234" } as never);
    await expect(controller.get()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});