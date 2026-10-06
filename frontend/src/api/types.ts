export type Role = "USER" | "STAFF" | "ADMIN";

export type RequestStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface SessionResponse {
  accessToken: string;
  user: PublicUser;
}

export interface AssigneeOption {
  id: string;
  fullName: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface RequestSummary {
  id: string;
  code: string;
  title: string;
  status: RequestStatus;
  category: { id: string; name: string };
  requester: { id: string; fullName: string; role: string };
  assignee: { id: string; fullName: string; role: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDetail extends RequestSummary {
  description: string;
  capabilities: {
    canAssign: boolean;
    canComment: boolean;
    statuses: RequestStatus[];
  };
  comments: Array<{
    id: string;
    body: string;
    createdAt: string;
    author: { id: string; fullName: string; role: string };
  }>;
  history: Array<{
    id: string;
    type: string;
    note: string;
    createdAt: string;
    actor: { id: string; fullName: string; role: string };
  }>;
}

export interface RequestPage {
  items: RequestSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export interface RequestSummaryCounts {
  total: number;
  byStatus: Record<RequestStatus, number>;
}
