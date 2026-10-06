import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { readAppEnv } from "../src/config/app-env";
import { configureApp } from "../src/configure-app";
import { PrismaService } from "../src/prisma/prisma.service";
import { seed } from "../src/seed";

const databaseUrl = process.env.DATABASE_URL ?? "";

describe("critical request flow", () => {
  let app: INestApplication;
  const password = randomBytes(12).toString("hex");

  beforeAll(async () => {
    if (!databaseUrl.includes("campusflow_test")) {
      throw new Error("Las pruebas e2e solo pueden usar la base campusflow_test.");
    }
    process.env.JWT_SECRET = randomBytes(32).toString("hex");
    process.env.SEED_ADMIN_EMAIL = "admin@campusflow.local";
    process.env.SEED_STAFF_EMAIL = "personal@campusflow.local";
    process.env.SEED_STUDENT_EMAIL = "estudiante@campusflow.local";
    process.env.SEED_ADMIN_PASSWORD = password;
    process.env.SEED_STAFF_PASSWORD = password;
    process.env.SEED_STUDENT_PASSWORD = password;
    process.env.CORS_ORIGIN = "http://localhost:5173";

    execSync("npx prisma migrate deploy", {
      cwd: __dirname + "/..",
      stdio: "inherit",
      env: process.env,
    });

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app, readAppEnv());
    await app.init();

    const prisma = app.get(PrismaService);
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "RequestHistory", "RequestComment", "Request", "Category", "User", "RequestCounter" RESTART IDENTITY CASCADE;',
    );
    await seed(prisma);
  });

  afterAll(async () => {
    await app?.close();
  });

  async function login(email: string) {
    const response = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email, password });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user.passwordHash).toBeUndefined();
    return {
      token: response.body.accessToken as string,
      user: response.body.user as { id: string; role: string },
    };
  }

  it("covers login, request care, history and administration", async () => {
    const student = await login("estudiante@campusflow.local");
    const staff = await login("personal@campusflow.local");
    const admin = await login("admin@campusflow.local");

    const categories = await request(app.getHttpServer())
      .get("/api/categories")
      .set("Authorization", `Bearer ${student.token}`);
    expect(categories.status).toBe(200);
    const academic = categories.body.find((category: { name: string }) => category.name === "Académica");
    expect(academic).toBeTruthy();

    const created = await request(app.getHttpServer())
      .post("/api/requests")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        categoryId: academic.id,
        title: "Cambio de grupo",
        description: "Necesito cambiar de grupo por cruce de horario.",
      });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe("PENDING");
    const requestId = created.body.id as string;

    const ownList = await request(app.getHttpServer())
      .get("/api/requests")
      .set("Authorization", `Bearer ${student.token}`);
    expect(ownList.body.total).toBe(1);

    const assigned = await request(app.getHttpServer())
      .patch(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${staff.token}`)
      .send({ assigneeId: staff.user.id });
    expect(assigned.status).toBe(200);
    expect(assigned.body.status).toBe("IN_REVIEW");
    expect(assigned.body.assignee.id).toBe(staff.user.id);

    const started = await request(app.getHttpServer())
      .patch(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${staff.token}`)
      .send({ status: "IN_PROGRESS" });
    expect(started.body.status).toBe("IN_PROGRESS");

    const commented = await request(app.getHttpServer())
      .post(`/api/requests/${requestId}/comments`)
      .set("Authorization", `Bearer ${staff.token}`)
      .send({ body: "El cambio quedó registrado en el sistema académico." });
    expect(commented.status).toBe(201);
    expect(commented.body.comments).toHaveLength(1);

    const resolved = await request(app.getHttpServer())
      .patch(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${staff.token}`)
      .send({ status: "RESOLVED" });
    expect(resolved.body.status).toBe("RESOLVED");

    const seen = await request(app.getHttpServer())
      .get(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${student.token}`);
    expect(seen.body.status).toBe("RESOLVED");
    expect(seen.body.history.map((entry: { type: string }) => entry.type)).toEqual(
      expect.arrayContaining(["CREATED", "ASSIGNED", "STATUS_CHANGED", "COMMENTED"]),
    );

    const forbidden = await request(app.getHttpServer())
      .patch(`/api/requests/${requestId}`)
      .set("Authorization", `Bearer ${student.token}`)
      .send({ status: "IN_PROGRESS" });
    expect(forbidden.status).toBe(403);

    const category = await request(app.getHttpServer())
      .post("/api/categories")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ name: "Bienestar", description: "Apoyo estudiantil." });
    expect(category.status).toBe(201);

    const staffDenied = await request(app.getHttpServer())
      .post("/api/categories")
      .set("Authorization", `Bearer ${staff.token}`)
      .send({ name: "No permitida", description: "Intento sin permiso." });
    expect(staffDenied.status).toBe(403);

    const deactivated = await request(app.getHttpServer())
      .patch(`/api/categories/${category.body.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ active: false });
    expect(deactivated.body.active).toBe(false);

    const rejected = await request(app.getHttpServer())
      .post("/api/requests")
      .set("Authorization", `Bearer ${student.token}`)
      .send({
        categoryId: category.body.id,
        title: "Solicitud de bienestar",
        description: "Esta categoría ya no debería aceptarse.",
      });
    expect(rejected.status).toBe(400);
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/auth/login")
      .send({ email: "estudiante@campusflow.local", password: "clave-incorrecta" });
    expect(response.status).toBe(401);
  });
});
