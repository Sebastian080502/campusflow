import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuthenticatedUser } from "../domain/request-policy";
import { CreateCommentDto, CreateRequestDto, ListRequestsQuery, UpdateRequestDto } from "./dto/request.dto";
import { RequestsService } from "./requests.service";

@Controller("requests")
export class RequestsController {
  constructor(@Inject(RequestsService) private readonly requests: RequestsService) {}

  @Get("summary")
  summary(@CurrentUser() actor: AuthenticatedUser) {
    return this.requests.summary(actor);
  }

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListRequestsQuery) {
    return this.requests.list(actor, query);
  }

  @Post()
  create(@CurrentUser() actor: AuthenticatedUser, @Body() body: CreateRequestDto) {
    return this.requests.create(actor, body);
  }

  @Get(":id")
  getById(@CurrentUser() actor: AuthenticatedUser, @Param("id") id: string) {
    return this.requests.getById(actor, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateRequestDto,
  ) {
    return this.requests.update(actor, id, body);
  }

  @Post(":id/comments")
  comment(
    @CurrentUser() actor: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.requests.comment(actor, id, body);
  }
}
