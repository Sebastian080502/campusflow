import { Role as PrismaRole, RequestStatus as PrismaStatus } from "@prisma/client";
import {
  DomainError,
  RequestStatus,
  Role,
  canComment,
  canViewRequest,
  describeCapabilities,
  planRequestChange,
  type Actor,
  type RequestSnapshot,
} from "./request-policy";

const student: Actor = { id: "student-1", role: Role.USER };
const otherStudent: Actor = { id: "student-2", role: Role.USER };
const staff: Actor = { id: "staff-1", role: Role.STAFF };
const otherStaff: Actor = { id: "staff-2", role: Role.STAFF };
const admin: Actor = { id: "admin-1", role: Role.ADMIN };

const pending: RequestSnapshot = {
  status: RequestStatus.PENDING,
  requesterId: student.id,
  assigneeId: null,
};

const activeStaff = { id: staff.id, role: Role.STAFF, active: true };
const activeOtherStaff = { id: otherStaff.id, role: Role.STAFF, active: true };

function expectDomainError(action: () => void, code: DomainError["code"]): void {
  try {
    action();
    throw new Error("Se esperaba un error de dominio.");
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe(code);
  }
}

describe("planRequestChange", () => {
  it("lets the requester cancel a pending request", () => {
    const planned = planRequestChange(pending, student, {
      status: RequestStatus.CANCELLED,
    });

    expect(planned.status).toBe(RequestStatus.CANCELLED);
    expect(planned.events).toEqual([
      {
        type: "STATUS_CHANGED",
        fromStatus: RequestStatus.PENDING,
        toStatus: RequestStatus.CANCELLED,
      },
    ]);
  });

  it("rejects cancellation by staff", () => {
    expectDomainError(
      () =>
        planRequestChange(pending, staff, { status: RequestStatus.CANCELLED }),
      "FORBIDDEN",
    );
  });

  it("rejects cancellation by another student", () => {
    expectDomainError(
      () =>
        planRequestChange(pending, otherStudent, {
          status: RequestStatus.CANCELLED,
        }),
      "FORBIDDEN",
    );
  });

  it("assigns a staff member and moves a pending request to review", () => {
    const planned = planRequestChange(pending, staff, { assignee: activeStaff });

    expect(planned).toEqual({
      status: RequestStatus.IN_REVIEW,
      assigneeId: staff.id,
      events: [
        {
          type: "ASSIGNED",
          fromStatus: RequestStatus.PENDING,
          toStatus: null,
        },
        {
          type: "STATUS_CHANGED",
          fromStatus: RequestStatus.PENDING,
          toStatus: RequestStatus.IN_REVIEW,
        },
      ],
    });
  });

  it("rejects an inactive or student assignee", () => {
    expectDomainError(
      () =>
        planRequestChange(pending, admin, {
          assignee: { id: "inactive", role: Role.STAFF, active: false },
        }),
      "VALIDATION",
    );
    expectDomainError(
      () =>
        planRequestChange(pending, admin, {
          assignee: { id: student.id, role: Role.USER, active: true },
        }),
      "VALIDATION",
    );
  });

  it("rejects assignment by a student", () => {
    expectDomainError(
      () => planRequestChange(pending, student, { assignee: activeStaff }),
      "FORBIDDEN",
    );
  });

  it("lets the assignee start and resolve the request", () => {
    const inReview: RequestSnapshot = {
      status: RequestStatus.IN_REVIEW,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    const started = planRequestChange(inReview, staff, {
      status: RequestStatus.IN_PROGRESS,
    });
    expect(started.status).toBe(RequestStatus.IN_PROGRESS);

    const inProgress: RequestSnapshot = { ...inReview, status: RequestStatus.IN_PROGRESS };
    const resolved = planRequestChange(inProgress, staff, {
      status: RequestStatus.RESOLVED,
    });
    expect(resolved.status).toBe(RequestStatus.RESOLVED);
  });

  it("rejects progress by staff who is not the assignee", () => {
    const inReview: RequestSnapshot = {
      status: RequestStatus.IN_REVIEW,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    expectDomainError(
      () =>
        planRequestChange(inReview, otherStaff, {
          status: RequestStatus.IN_PROGRESS,
        }),
      "FORBIDDEN",
    );
  });

  it("lets an admin continue a request assigned to someone else", () => {
    const inProgress: RequestSnapshot = {
      status: RequestStatus.IN_PROGRESS,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    const planned = planRequestChange(inProgress, admin, {
      status: RequestStatus.RESOLVED,
    });
    expect(planned.status).toBe(RequestStatus.RESOLVED);
  });

  it("lets the requester or the assignee close a resolved request", () => {
    const resolved: RequestSnapshot = {
      status: RequestStatus.RESOLVED,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    expect(planRequestChange(resolved, student, { status: RequestStatus.CLOSED }).status).toBe(
      RequestStatus.CLOSED,
    );
    expect(planRequestChange(resolved, staff, { status: RequestStatus.CLOSED }).status).toBe(
      RequestStatus.CLOSED,
    );
  });

  it("lets the assignee reopen a resolved request", () => {
    const resolved: RequestSnapshot = {
      status: RequestStatus.RESOLVED,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    const planned = planRequestChange(resolved, staff, {
      status: RequestStatus.IN_PROGRESS,
    });
    expect(planned.status).toBe(RequestStatus.IN_PROGRESS);
  });

  it("rejects skipping from pending to in progress", () => {
    expectDomainError(
      () =>
        planRequestChange(pending, admin, { status: RequestStatus.IN_PROGRESS }),
      "CONFLICT",
    );
  });

  it("rejects changes on terminal requests", () => {
    const closed: RequestSnapshot = {
      status: RequestStatus.CLOSED,
      requesterId: student.id,
      assigneeId: staff.id,
    };
    expectDomainError(
      () => planRequestChange(closed, admin, { assignee: activeOtherStaff }),
      "CONFLICT",
    );
    expectDomainError(
      () => planRequestChange(closed, admin, { status: RequestStatus.IN_PROGRESS }),
      "CONFLICT",
    );
  });

  it("rejects an empty change", () => {
    expectDomainError(() => planRequestChange(pending, admin, {}), "VALIDATION");
  });

  it("allows assignment and start in a single command by the new assignee", () => {
    const planned = planRequestChange(pending, staff, {
      assignee: activeStaff,
      status: RequestStatus.IN_PROGRESS,
    });
    expect(planned.status).toBe(RequestStatus.IN_PROGRESS);
    expect(planned.events.map((event) => event.type)).toEqual([
      "ASSIGNED",
      "STATUS_CHANGED",
      "STATUS_CHANGED",
    ]);
  });
});

describe("capabilities and visibility", () => {
  it("shows cancel to the requester and assignment to staff while pending", () => {
    expect(describeCapabilities(pending, student)).toMatchObject({
      canAssign: false,
      canComment: true,
      statuses: [RequestStatus.CANCELLED],
    });
    expect(describeCapabilities(pending, staff)).toMatchObject({
      canAssign: true,
      canComment: true,
      statuses: [],
    });
  });

  it("hides comments and assignment after the request is terminal", () => {
    const cancelled: RequestSnapshot = {
      ...pending,
      status: RequestStatus.CANCELLED,
    };
    expect(canComment(cancelled, student)).toBe(false);
    expect(describeCapabilities(cancelled, admin).canAssign).toBe(false);
  });

  it("limits students to their own requests", () => {
    expect(canViewRequest(student, student.id)).toBe(true);
    expect(canViewRequest(student, otherStudent.id)).toBe(false);
    expect(canViewRequest(staff, student.id)).toBe(true);
    expect(canViewRequest(admin, otherStudent.id)).toBe(true);
  });

  it("matches the database enums", () => {
    expect(Object.values(Role).sort()).toEqual(Object.values(PrismaRole).sort());
    expect(Object.values(RequestStatus).sort()).toEqual(
      Object.values(PrismaStatus).sort(),
    );
  });
});
