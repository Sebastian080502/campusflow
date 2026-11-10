import { Inject, Injectable } from "@nestjs/common";
import { HistoryType as PrismaHistoryType, Prisma, RequestStatus as PrismaRequestStatus } from "@prisma/client";
import { PlannedRequestChange, RequestStatus, Role } from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import {
  DetailRecord,
  ListRecord,
  historyNote,
  requestDetailInclude,
  requestListInclude,
} from "./request.presenter";

export const REQUESTS_REPOSITORY = Symbol("REQUESTS_REPOSITORY");

export interface RequestScope {
  requesterId?: string;
}

export interface RequestPageQuery {
  scope: RequestScope;
  page: number;
  pageSize: number;
  status?: RequestStatus;
  categoryId?: string;
  assigneeId?: string;
  q?: string;
}

export interface NewRequestInput {
  title: string;
  description: string;
  categoryId: string;
  requesterId: string;
}

export interface AssigneeRecord {
  id: string;
  role: Role;
  active: boolean;
  fullName: string;
}

export interface RequestsRepository {
  countByStatus(scope: RequestScope): Promise<Array<{ status: string; count: number }>>;
  findPage(query: RequestPageQuery): Promise<{ total: number; rows: ListRecord[] }>;
  findDetail(id: string): Promise<DetailRecord | null>;
  findActiveCategory(id: string): Promise<{ id: string } | null>;
  findAssignee(id: string): Promise<AssigneeRecord | null>;
  createWithHistory(input: NewRequestInput): Promise<string>;
  applyChange(
    id: string,
    actorId: string,
    planned: PlannedRequestChange,
    assigneeName?: string,
  ): Promise<void>;
  addComment(id: string, actorId: string, body: string): Promise<void>;
  nextCode(tx?: Prisma.TransactionClient): Promise<string>;
}

@Injectable()
export class PrismaRequestsRepository implements RequestsRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async countByStatus(scope: RequestScope): Promise<Array<{ status: string; count: number }>> {
    const grouped = await this.prisma.request.groupBy({
      by: ["status"],
      where: scope.requesterId ? { requesterId: scope.requesterId } : {},
      _count: { _all: true },
    });
    return grouped.map((row) => ({ status: row.status, count: row._count._all }));
  }

  async findPage(query: RequestPageQuery): Promise<{ total: number; rows: ListRecord[] }> {
    const where: Prisma.RequestWhereInput = {
      ...(query.scope.requesterId ? { requesterId: query.scope.requesterId } : {}),
      status: query.status,
      categoryId: query.categoryId,
    };
    if (query.assigneeId) {
      where.assigneeId = query.assigneeId;
    }
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { code: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.request.count({ where }),
      this.prisma.request.findMany({
        where,
        include: requestListInclude,
        orderBy: { updatedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);

    return { total, rows };
  }

  findDetail(id: string): Promise<DetailRecord | null> {
    return this.prisma.request.findUnique({
      where: { id },
      include: requestDetailInclude,
    });
  }

  findActiveCategory(id: string): Promise<{ id: string } | null> {
    return this.prisma.category.findFirst({
      where: { id, active: true },
      select: { id: true },
    });
  }

  async findAssignee(id: string): Promise<AssigneeRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, active: true, fullName: true },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      role: user.role as Role,
      active: user.active,
      fullName: user.fullName,
    };
  }

  async createWithHistory(input: NewRequestInput): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.request.create({
        data: {
          code: await this.nextCode(tx),
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          requesterId: input.requesterId,
          status: PrismaRequestStatus.PENDING,
        },
      });
      await tx.requestHistory.create({
        data: {
          requestId: request.id,
          actorId: input.requesterId,
          type: PrismaHistoryType.CREATED,
          toStatus: PrismaRequestStatus.PENDING,
          note: "Solicitud registrada.",
        },
      });
      return request.id;
    });
  }

  async applyChange(
    id: string,
    actorId: string,
    planned: PlannedRequestChange,
    assigneeName?: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.request.update({
        where: { id },
        data: {
          status: planned.status as PrismaRequestStatus,
          assigneeId: planned.assigneeId,
        },
      });
      for (const event of planned.events) {
        await tx.requestHistory.create({
          data: {
            requestId: id,
            actorId,
            type: event.type as PrismaHistoryType,
            fromStatus: event.fromStatus as PrismaRequestStatus | null,
            toStatus: event.toStatus as PrismaRequestStatus | null,
            note: historyNote(event, assigneeName),
          },
        });
      }
    });
  }

  async addComment(id: string, actorId: string, body: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.requestComment.create({
        data: {
          requestId: id,
          authorId: actorId,
          body,
        },
      });
      await tx.requestHistory.create({
        data: {
          requestId: id,
          actorId,
          type: PrismaHistoryType.COMMENTED,
          note: "Se agregó un comentario.",
        },
      });
      await tx.request.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    });
  }

  async nextCode(tx?: Prisma.TransactionClient): Promise<string> {
    const db = tx ?? this.prisma;
    const row = await db.requestCounter.upsert({
      where: { id: 1 },
      create: { id: 1, value: 1 },
      update: { value: { increment: 1 } },
    });
    return `CF-${String(row.value).padStart(4, "0")}`;
  }
}
