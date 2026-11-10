import { Global, Module } from "@nestjs/common";
import { APP_ENV, readAppEnv } from "./app-env";

@Global()
@Module({
  providers: [
    {
      provide: APP_ENV,
      useFactory: () => readAppEnv(),
    },
  ],
  exports: [APP_ENV],
})
export class AppConfigModule {}
