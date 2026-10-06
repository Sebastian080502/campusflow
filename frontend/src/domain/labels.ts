import { readErrorMessage } from "../api/client";
import type { RequestStatus } from "../api/types";

export const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelta",
  CLOSED: "Cerrada",
  CANCELLED: "Cancelada",
};

export const ROLE_LABEL = {
  USER: "Estudiante",
  STAFF: "Personal encargado",
  ADMIN: "Administrador",
} as const;

export const STATUS_ACTION: Record<RequestStatus, string> = {
  PENDING: "Volver a pendiente",
  IN_REVIEW: "Pasar a en revisión",
  IN_PROGRESS: "Pasar a en proceso",
  RESOLVED: "Marcar como resuelta",
  CLOSED: "Cerrar solicitud",
  CANCELLED: "Cancelar solicitud",
};

export function formatWhen(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export { readErrorMessage };
