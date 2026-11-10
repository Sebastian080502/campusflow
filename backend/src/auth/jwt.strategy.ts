import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { APP_ENV, AppEnv } from "../config/app-env";
import { AuthenticatedUser } from "../domain/request-policy";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) users: UsersService,
    @Inject(APP_ENV) env: AppEnv,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
    this.users = users;
  }

  private readonly users: UsersService;

  async validate(payload: { sub?: string }): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException("Sesión no válida.");
    }
    const user = await this.users.findActiveById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Sesión no válida.");
    }
    return user;
  }
}
