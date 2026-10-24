import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "./users/password";

const CATEGORIES = [
  {
    name: "Académica",
    description: "Asignaturas, notas, horarios y procesos académicos.",
  },
  {
    name: "Administrativa",
    description: "Certificados, matrícula y trámites administrativos.",
  },
  {
    name: "Tecnológica",
    description: "Accesos, plataformas y soporte de sistemas.",
  },
  {
    name: "Infraestructura",
    description: "Espacios físicos, aulas y mantenimiento.",
  },
  {
    name: "Otra",
    description: "Solicitudes que no encajan en las categorías anteriores.",
  },
];

interface DemoUser {
  emailEnv: string;
  nameEnv: string;
  passwordEnv: string;
  defaultEmail: string;
  defaultName: string;
  role: Role;
}

const DEMO_USERS: DemoUser[] = [
  {
    emailEnv: "SEED_ADMIN_EMAIL",
    nameEnv: "SEED_ADMIN_NAME",
    passwordEnv: "SEED_ADMIN_PASSWORD",
    defaultEmail: "admin@campusflow.local",
    defaultName: "Ana Administradora",
    role: Role.ADMIN,
  },
  {
    emailEnv: "SEED_STAFF_EMAIL",
    nameEnv: "SEED_STAFF_NAME",
    passwordEnv: "SEED_STAFF_PASSWORD",
    defaultEmail: "personal@campusflow.local",
    defaultName: "Luis Encargado",
    role: Role.STAFF,
  },
  {
    emailEnv: "SEED_STUDENT_EMAIL",
    nameEnv: "SEED_STUDENT_NAME",
    passwordEnv: "SEED_STUDENT_PASSWORD",
    defaultEmail: "estudiante@campusflow.local",
    defaultName: "María Estudiante",
    role: Role.USER,
  },
];

export async function seed(prisma: PrismaClient): Promise<void> {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      create: category,
      update: { description: category.description, active: true },
    });
  }

  for (const demoUser of DEMO_USERS) {
    await upsertDemoUser(prisma, demoUser);
  }
}

async function upsertDemoUser(prisma: PrismaClient, demoUser: DemoUser): Promise<void> {
  const password = process.env[demoUser.passwordEnv];
  const email = (process.env[demoUser.emailEnv] ?? demoUser.defaultEmail).toLowerCase();
  if (!password) {
    console.warn(`Seed omitido para ${email}: falta ${demoUser.passwordEnv}.`);
    return;
  }
  if (password.length < 8) {
    throw new Error(`${demoUser.passwordEnv} debe tener al menos 8 caracteres.`);
  }

  const fullName = process.env[demoUser.nameEnv] ?? demoUser.defaultName;
  const passwordHash = await hashPassword(password);
  await prisma.user.upsert({
    where: { email },
    create: { email, fullName, passwordHash, role: demoUser.role, active: true },
    update: { fullName, passwordHash, role: demoUser.role, active: true },
  });
  console.log(`Seed de usuario listo: ${email} (${demoUser.role}).`);
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
    throw new Error("DATABASE_URL debe apuntar a PostgreSQL.");
  }
  const prisma = new PrismaClient();
  try {
    await seed(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
