import { isResetUsable, resetExpiry } from "./reset-token";

describe("password reset token", () => {
  it("expires thirty minutes after it is issued", () => {
    const now = new Date("2026-10-20T12:00:00.000Z");
    expect(resetExpiry(now).toISOString()).toBe("2026-10-20T12:30:00.000Z");
  });

  it("rejects a used or expired token", () => {
    const now = new Date("2026-10-20T12:40:00.000Z");
    expect(isResetUsable({ usedAt: null, expiresAt: new Date("2026-10-20T12:30:00.000Z") }, now)).toBe(false);
    expect(isResetUsable({ usedAt: now, expiresAt: new Date("2026-10-20T13:00:00.000Z") }, now)).toBe(false);
    expect(isResetUsable({ usedAt: null, expiresAt: new Date("2026-10-20T13:00:00.000Z") }, now)).toBe(true);
  });
});
