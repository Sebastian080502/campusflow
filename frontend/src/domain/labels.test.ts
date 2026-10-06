import { describe, expect, it } from "vitest";
import { readErrorMessage } from "../api/client";
import { STATUS_ACTION, STATUS_HINT, STATUS_LABEL } from "./labels";
import type { RequestStatus } from "../api/types";

const statuses: RequestStatus[] = [
  "PENDING",
  "IN_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

describe("request labels", () => {
  it("names every status in Spanish", () => {
    expect(statuses.map((status) => STATUS_LABEL[status])).toEqual([
      "Pendiente",
      "En revisión",
      "En proceso",
      "Resuelta",
      "Cerrada",
      "Cancelada",
    ]);
  });

  it("offers an action label for every status the API can return", () => {
    for (const status of statuses) {
      expect(STATUS_ACTION[status].length).toBeGreaterThan(3);
      expect(STATUS_HINT[status].length).toBeGreaterThan(10);
    }
  });
});

describe("readErrorMessage", () => {
  it("joins validation messages", () => {
    expect(readErrorMessage({ message: ["El título es corto.", "Falta la categoría."] })).toBe(
      "El título es corto. Falta la categoría.",
    );
  });

  it("falls back when the payload has no message", () => {
    expect(readErrorMessage(null)).toBe("No se pudo completar la acción.");
  });
});
