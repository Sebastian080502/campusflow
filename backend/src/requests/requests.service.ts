import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HistoryType as PrismaHistoryType, Prisma, RequestStatus as PrismaRequestStatus } from "@prisma/client";
import { rethrowDomain } from "../common/domain-http";
import {
  AuthenticatedUser,
  HistoryType,
  RequestStatus,
  Role,
  canComment,
  canViewRequest,
  planRequestChange,
} from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto, CreateRequestDto, ListRequestsQuery, UpdateRequestDto } from "./dto/request.dto";
import {
  DetailRecord,
  historyNote,
  requestDetailInclude,
  requestListInclude,
  toRequestDetail,
  toRequestSummary,
} from "./request.presenter";

@Injectable()
export class RequestsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async summary(actor: AuthenticatedUser) {
    const grouped = await this.prisma.request.groupBy({
      by: ["status"],
      where: this.visibilityWhere(actor),
      _count: { _all: true },
    });
    const byStatus = Object.fromEntries(
      Object.values(RequestStatus).map((status) => [status, 0]),
    ) as Record<RequestStatus, number>;
    for (const row of grouped) {
      byStatus[row.status as RequestStatus] = row._count._all;
    }
    const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
    return { total, byStatus };
  }

  async list(actor: AuthenticatedUser, query: ListRequestsQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.RequestWhereInput = {
      ...this.visibilityWhere(actor),
      status: query.status,
      categoryId: query.categoryId,
    };
    if (actor.role !== Role.USER && query.assigneeId) {
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: rows.map(toRequestSummary),
      page,
      pageSize,
      total,
    };
  }

  async getById(actor: AuthenticatedUser, id: string) {
    const request = await this.findVisible(actor, id);
    return toRequestDetail(request, actor);
  }

  async create(actor: AuthenticatedUser, input: CreateRequestDto) {
    if (actor.role !== Role.USER) {
      throw new ForbiddenException("Solo un estudiante puede registrar una solicitud.");
    }

    const category = await this.prisma.category.findFirst({
      where: { id: input.categoryId, active: true },
    });
    if (!category) {
      throw new BadRequestException("La categoría no existe o está inactiva.");
    }

    const requestId = await this.prisma.$transaction(async (tx) => {
      const request = await tx.request.create({
        data: {
          code: await this.nextCode(tx),
          title: input.title.trim(),
          description: input.description.trim(),
          categoryId: category.id,
          requesterId: actor.id,
          status: PrismaRequestStatus.PENDING,
        },
      });
      await tx.requestHistory.create({
        data: {
          requestId: request.id,
          actorId: actor.id,
          type: PrismaHistoryType.CREATED,
          toStatus: PrismaRequestStatus.PENDING,
          note: "Solicitud registrada.",
        },
      });
      return request.id;
    });

    return this.getById(actor, requestId);
  }

  async update(actor: AuthenticatedUser, id: string, input: UpdateRequestDto) {
    const current = await this.findVisible(actor, id);
    const assignee =
      input.assigneeId && input.assigneeId !== current.assigneeId
        ? await this.prisma.user.findUnique({ where: { id: input.assigneeId } })
        : null;

    if (input.assigneeId && input.assigneeId !== current.assigneeId && !assignee) {
      throw new NotFoundException("El responsable indicado no existe.");
    }

    let planned;
    try {
      planned = planRequestChange(
        {
          status: current.status as RequestStatus,
          requesterId: current.requesterId,
          assigneeId: current.assigneeId,
        },
        actor,
        {
          status: input.status,
          assignee: assignee
            ? { id: assignee.id, role: assignee.role as Role, active: assignee.active }
            : undefined,
        },
      );
    } catch (error) {
      rethrowDomain(error);
    }

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
            actorId: actor.id,
            type: event.type as PrismaHistoryType,
            fromStatus: event.fromStatus as PrismaRequestStatus | null,
            toStatus: event.toStatus as PrismaRequestStatus | null,
            note: historyNote(event, assignee?.fullName),
          },
        });
      }
    });

    return this.getById(actor, id);
  }

  async comment(actor: AuthenticatedUser, id: string, input: CreateCommentDto) {
    const current = await this.findVisible(actor, id);
    if (
      !canComment(
        {
          status: current.status as RequestStatus,
          requesterId: current.requesterId,
          assigneeId: current.assigneeId,
        },
        actor,
      )
    ) {
      throw new ForbiddenException("No puedes comentar esta solicitud.");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.requestComment.create({
        data: {
          requestId: id,
          authorId: actor.id,
          body: input.body.trim(),
        },
      });
      await tx.requestHistory.create({
        data: {
          requestId: id,
          actorId: actor.id,
          type: HistoryType.COMMENTED as PrismaHistoryType,
          note: "Se agregó un comentario.",
        },
      });
      await tx.request.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    });

    return this.getById(actor, id);
  }

  private visibilityWhere(actor: AuthenticatedUser): Prisma.RequestWhereInput {
    return actor.role === Role.USER ? { requesterId: actor.id } : {};
  }

  private async findVisible(actor: AuthenticatedUser, id: string): Promise<DetailRecord> {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: requestDetailInclude,
    });
    if (!request || !canViewRequest(actor, request.requesterId)) {
      throw new NotFoundException("Solicitud no encontrada.");
    }
    return request;
  }

  private async nextCode(tx: Prisma.TransactionClient): Promise<string> {
    const row = await tx.requestCounter.upsert({
      where: { id: 1 },
      create: { id: 1, value: 1 },
      update: { value: { increment: 1 } },
    });
    return `CF-${String(row.value).padStart(4, "0")}`;
  }
}
