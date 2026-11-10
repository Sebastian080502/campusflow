export class DomainError extends Error {
  constructor(
    readonly code: "FORBIDDEN" | "CONFLICT" | "VALIDATION",
    message: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export const Role = {
  USER: "USER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const RequestStatus = {
  PENDING: "PENDING",
  IN_REVIEW: "IN_REVIEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const REQUEST_STATUSES = Object.values(RequestStatus);

export const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelta",
  CLOSED: "Cerrada",
  CANCELLED: "Cancelada",
};

export const HistoryType = {
  CREATED: "CREATED",
  STATUS_CHANGED: "STATUS_CHANGED",
  ASSIGNED: "ASSIGNED",
  COMMENTED: "COMMENTED",
} as const;

export type HistoryType = (typeof HistoryType)[keyof typeof HistoryType];

const ALLOWED_TRANSITIONS: Record<RequestStatus, readonly RequestStatus[]> = {
  PENDING: [RequestStatus.IN_REVIEW, RequestStatus.CANCELLED],
  IN_REVIEW: [RequestStatus.IN_PROGRESS, RequestStatus.CANCELLED],
  IN_PROGRESS: [RequestStatus.RESOLVED],
  RESOLVED: [RequestStatus.CLOSED, RequestStatus.IN_PROGRESS],
  CLOSED: [],
  CANCELLED: [],
};

export const TERMINAL_STATUSES: readonly RequestStatus[] = [
  RequestStatus.CLOSED,
  RequestStatus.CANCELLED,
];

export interface Actor {
  id: string;
  role: Role;
}

export interface AuthenticatedUser extends Actor {
  email: string;
  fullName: string;
  active: boolean;
}

export interface RequestSnapshot {
  status: RequestStatus;
  requesterId: string;
  assigneeId: string | null;
}

export interface AssigneeCandidate {
  id: string;
  role: Role;
  active: boolean;
}

export interface HistoryEventDraft {
  type: "STATUS_CHANGED" | "ASSIGNED";
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus | null;
}

export interface PlannedRequestChange {
  status: RequestStatus;
  assigneeId: string | null;
  events: HistoryEventDraft[];
}

export interface RequestChangeCommand {
  status?: RequestStatus;
  assignee?: AssigneeCandidate;
}

export interface RequestCapabilities {
  canAssign: boolean;
  canComment: boolean;
  statuses: RequestStatus[];
}

export function isStaffSide(role: Role): boolean {
  return role === Role.STAFF || role === Role.ADMIN;
}

export function canViewRequest(actor: Actor, requesterId: string): boolean {
  if (actor.role === Role.USER) {
    return actor.id === requesterId;
  }
  return isStaffSide(actor.role);
}

export function canComment(snapshot: RequestSnapshot, actor: Actor): boolean {
  if (TERMINAL_STATUSES.includes(snapshot.status)) {
    return false;
  }
  if (isStaffSide(actor.role)) {
    return true;
  }
  return actor.id === snapshot.requesterId;
}

function assertTransitionAllowed(from: RequestStatus, to: RequestStatus): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new DomainError(
      "CONFLICT",
      `No se puede pasar de ${STATUS_LABEL[from]} a ${STATUS_LABEL[to]}.`,
    );
  }
}

function assertActorCanApplyStatus(
  snapshot: RequestSnapshot,
  actor: Actor,
  nextStatus: RequestStatus,
  assigneeId: string | null,
): void {
  if (nextStatus === RequestStatus.CANCELLED) {
    if (actor.id !== snapshot.requesterId) {
      throw new DomainError(
        "FORBIDDEN",
        "Solo quien creó la solicitud puede cancelarla.",
      );
    }
    return;
  }

  if (nextStatus === RequestStatus.CLOSED) {
    const isRequester = actor.id === snapshot.requesterId;
    const isAssignee = assigneeId !== null && actor.id === assigneeId;
    if (!isRequester && !isAssignee && actor.role !== Role.ADMIN) {
      throw new DomainError("FORBIDDEN", "No puedes cerrar esta solicitud.");
    }
    return;
  }

  if (!isStaffSide(actor.role)) {
    throw new DomainError(
      "FORBIDDEN",
      "No tienes permiso para cambiar este estado.",
    );
  }

  if (nextStatus === RequestStatus.IN_REVIEW) {
    if (assigneeId === null) {
      throw new DomainError(
        "VALIDATION",
        "Asigna un responsable para pasar la solicitud a revisión.",
      );
    }
    return;
  }

  const isAssignee = assigneeId !== null && actor.id === assigneeId;
  if (!isAssignee && actor.role !== Role.ADMIN) {
    throw new DomainError(
      "FORBIDDEN",
      "Solo el responsable asignado o un administrador puede continuar la atención.",
    );
  }
}

export function planRequestChange(
  snapshot: RequestSnapshot,
  actor: Actor,
  command: RequestChangeCommand,
): PlannedRequestChange {
  if (command.status === undefined && command.assignee === undefined) {
    throw new DomainError("VALIDATION", "Indica un estado o un responsable.");
  }

  let status = snapshot.status;
  let assigneeId = snapshot.assigneeId;
  const events: HistoryEventDraft[] = [];

  if (command.assignee && command.assignee.id !== assigneeId) {
    if (!isStaffSide(actor.role)) {
      throw new DomainError("FORBIDDEN", "No puedes asignar responsables.");
    }
    if (TERMINAL_STATUSES.includes(status)) {
      throw new DomainError(
        "CONFLICT",
        "No se puede reasignar una solicitud cerrada o cancelada.",
      );
    }
    if (!command.assignee.active || !isStaffSide(command.assignee.role)) {
      throw new DomainError(
        "VALIDATION",
        "El responsable debe ser personal activo o un administrador activo.",
      );
    }

    assigneeId = command.assignee.id;
    events.push({
      type: "ASSIGNED",
      fromStatus: snapshot.status,
      toStatus: null,
    });

    if (status === RequestStatus.PENDING) {
      status = RequestStatus.IN_REVIEW;
      events.push({
        type: "STATUS_CHANGED",
        fromStatus: RequestStatus.PENDING,
        toStatus: RequestStatus.IN_REVIEW,
      });
    }
  }

  if (command.status !== undefined && command.status !== status) {
    assertTransitionAllowed(status, command.status);
    assertActorCanApplyStatus(snapshot, actor, command.status, assigneeId);
    const fromStatus = status;
    status = command.status;
    events.push({
      type: "STATUS_CHANGED",
      fromStatus,
      toStatus: status,
    });
  }

  if (events.length === 0) {
    throw new DomainError(
      "VALIDATION",
      "La solicitud ya tiene ese estado y responsable.",
    );
  }

  return { status, assigneeId, events };
}

export function describeCapabilities(
  snapshot: RequestSnapshot,
  actor: Actor,
): RequestCapabilities {
  const statuses = REQUEST_STATUSES.filter((candidate) => {
    if (candidate === snapshot.status) {
      return false;
    }
    try {
      planRequestChange(snapshot, actor, { status: candidate });
      return true;
    } catch {
      return false;
    }
  });

  return {
    canAssign:
      isStaffSide(actor.role) && !TERMINAL_STATUSES.includes(snapshot.status),
    canComment: canComment(snapshot, actor),
    statuses,
  };
}
