import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AuthenticatedUser, Role } from "../domain/request-policy";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(@Inject(CategoriesService) private readonly categories: CategoriesService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser) {
    return this.categories.list(actor);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateCategoryDto) {
    return this.categories.create(body);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() body: UpdateCategoryDto) {
    return this.categories.update(id, body);
  }
}
