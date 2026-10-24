import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { rethrowDomain } from "../common/domain-http";
import {
  AuthenticatedUser,
  RequestStatus,
  Role,
  canComment,
  canViewRequest,
  planRequestChange,
} from "../domain/request-policy";
import { CreateCommentDto, CreateRequestDto, ListRequestsQuery, UpdateRequestDto } from "./dto/request.dto";
import { DetailRecord, toRequestDetail, toRequestSummary } from "./request.presenter";
import { REQUESTS_REPOSITORY, RequestScope, RequestsRepository } from "./requests.repository";

@Injectable()
export class RequestsService {
  constructor(@Inject(REQUESTS_REPOSITORY) private readonly requests: RequestsRepository) {}

  async summary(actor: AuthenticatedUser) {
    const grouped = await this.requests.countByStatus(this.scope(actor));
    const byStatus = Object.fromEntries(
      Object.values(RequestStatus).map((status) => [status, 0]),
    ) as Record<RequestStatus, number>;
    for (const row of grouped) {
      byStatus[row.status as RequestStatus] = row.count;
    }
    const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
    return { total, byStatus };
  }

  async list(actor: AuthenticatedUser, query: ListRequestsQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { total, rows } = await this.requests.findPage({
      scope: this.scope(actor),
      page,
      pageSize,
      status: query.status,
      categoryId: query.categoryId,
      assigneeId: actor.role === Role.USER ? undefined : query.assigneeId,
      q: query.q,
    });

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

    const category = await this.requests.findActiveCategory(input.categoryId);
    if (!category) {
      throw new BadRequestException("La categoría no existe o está inactiva.");
    }

    const requestId = await this.requests.createWithHistory({
      title: input.title.trim(),
      description: input.description.trim(),
      categoryId: category.id,
      requesterId: actor.id,
    });

    return this.getById(actor, requestId);
  }

  async update(actor: AuthenticatedUser, id: string, input: UpdateRequestDto) {
    const current = await this.findVisible(actor, id);
    const assignee =
      input.assigneeId && input.assigneeId !== current.assigneeId
        ? await this.requests.findAssignee(input.assigneeId)
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
            ? { id: assignee.id, role: assignee.role, active: assignee.active }
            : undefined,
        },
      );
    } catch (error) {
      rethrowDomain(error);
    }

    await this.requests.applyChange(id, actor.id, planned, assignee?.fullName);
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

    await this.requests.addComment(id, actor.id, input.body.trim());
    return this.getById(actor, id);
  }

  private scope(actor: AuthenticatedUser): RequestScope {
    return actor.role === Role.USER ? { requesterId: actor.id } : {};
  }

  private async findVisible(actor: AuthenticatedUser, id: string): Promise<DetailRecord> {
    const request = await this.requests.findDetail(id);
    if (!request || !canViewRequest(actor, request.requesterId)) {
      throw new NotFoundException("Solicitud no encontrada.");
    }
    return request;
  }
}
