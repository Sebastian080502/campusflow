import {
  AuthenticatedUser,
  HistoryEventDraft,
  HistoryType,
  RequestStatus,
  STATUS_LABEL,
  describeCapabilities,
} from "../domain/request-policy";

const personSelect = { id: true, fullName: true, role: true } as const;

export const requestListInclude = {
  category: { select: { id: true, name: true } },
  requester: { select: personSelect },
  assignee: { select: personSelect },
} as const;

export const requestDetailInclude = {
  ...requestListInclude,
  comments: {
    orderBy: { createdAt: "asc" as const },
    include: { author: { select: personSelect } },
  },
  history: {
    orderBy: { createdAt: "asc" as const },
    include: { actor: { select: personSelect } },
  },
} as const;

type Person = { id: string; fullName: string; role: string };

type ListRecord = {
  id: string;
  code: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string };
  requester: Person;
  assignee: Person | null;
};

export type DetailRecord = ListRecord & {
  description: string;
  requesterId: string;
  assigneeId: string | null;
  comments: Array<{ id: string; body: string; createdAt: Date; author: Person }>;
  history: Array<{
    id: string;
    type: string;
    fromStatus: string | null;
    toStatus: string | null;
    note: string;
    createdAt: Date;
    actor: Person;
  }>;
};

function toPerson(person: Person) {
  return { id: person.id, fullName: person.fullName, role: person.role };
}

export function toRequestSummary(request: ListRecord) {
  return {
    id: request.id,
    code: request.code,
    title: request.title,
    status: request.status,
    category: request.category,
    requester: toPerson(request.requester),
    assignee: request.assignee ? toPerson(request.assignee) : null,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

export function toRequestDetail(request: DetailRecord, actor: AuthenticatedUser) {
  return {
    ...toRequestSummary(request),
    description: request.description,
    capabilities: describeCapabilities(
      {
        status: request.status as RequestStatus,
        requesterId: request.requesterId,
        assigneeId: request.assigneeId,
      },
      actor,
    ),
    comments: request.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      author: toPerson(comment.author),
    })),
    history: request.history.map((entry) => ({
      id: entry.id,
      type: entry.type,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      note: entry.note,
      createdAt: entry.createdAt.toISOString(),
      actor: toPerson(entry.actor),
    })),
  };
}

export function historyNote(event: HistoryEventDraft, assigneeName?: string): string {
  if (event.type === HistoryType.ASSIGNED) {
    return `Responsable asignado: ${assigneeName ?? "personal encargado"}.`;
  }
  const fromStatus = event.fromStatus ? STATUS_LABEL[event.fromStatus] : "sin estado";
  const toStatus = event.toStatus ? STATUS_LABEL[event.toStatus] : "sin estado";
  return `Estado actualizado de ${fromStatus} a ${toStatus}.`;
}
