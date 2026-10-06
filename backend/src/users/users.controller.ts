import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { AuthenticatedUser, Role } from "../domain/request-policy";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  list() {
    return this.users.list();
  }

  @Get("assignees")
  @Roles(Role.STAFF, Role.ADMIN)
  listAssignees() {
    return this.users.listAssignees();
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateUserDto) {
    return this.users.create(body);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.users.update(actor, id, body);
  }
}
