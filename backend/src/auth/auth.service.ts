import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../domain/request-policy";
import { verifyPassword } from "../users/password";
import { PublicUser, toPublicUser } from "../users/user.presenter";
import { UsersService } from "../users/users.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly users: UsersService,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const existing = await this.users.findByEmailWithSecret(input.email);
    if (existing) {
      throw new ConflictException("Ya existe una cuenta con ese correo.");
    }
    const user = await this.users.create({ ...input, role: Role.USER });
    return this.issue(user);
  }

  async login(input: LoginDto) {
    const user = await this.users.findByEmailWithSecret(input.email);
    const passwordMatches = user
      ? await verifyPassword(input.password, user.passwordHash)
      : false;
    if (!user || !passwordMatches) {
      throw new UnauthorizedException("Correo o contraseña incorrectos.");
    }
    if (!user.active) {
      throw new UnauthorizedException("La cuenta está inactiva. Contacta al administrador.");
    }
    return this.issue(toPublicUser(user));
  }

  private issue(user: PublicUser) {
    return {
      accessToken: this.jwt.sign({ sub: user.id }),
      user,
    };
  }
}
