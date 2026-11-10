import { createHash, randomBytes } from "node:crypto";

const RESET_TTL_MS = 30 * 60 * 1000;

export function createResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function resetExpiry(now = new Date()): Date {
  return new Date(now.getTime() + RESET_TTL_MS);
}

export function isResetUsable(
  token: { usedAt: Date | null; expiresAt: Date },
  now = new Date(),
): boolean {
  return token.usedAt === null && token.expiresAt.getTime() > now.getTime();
}
