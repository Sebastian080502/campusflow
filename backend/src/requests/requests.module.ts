import { Module } from "@nestjs/common";
import { RequestsController } from "./requests.controller";
import { PrismaRequestsRepository, REQUESTS_REPOSITORY } from "./requests.repository";
import { RequestsService } from "./requests.service";

@Module({
  controllers: [RequestsController],
  providers: [
    RequestsService,
    PrismaRequestsRepository,
    { provide: REQUESTS_REPOSITORY, useExisting: PrismaRequestsRepository },
  ],
})
export class RequestsModule {}
