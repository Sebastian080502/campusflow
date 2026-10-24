import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { APP_ENV, AppEnv } from "../config/app-env";
import { Role } from "../domain/request-policy";
import { PrismaService } from "../prisma/prisma.service";
import { hashPassword, verifyPassword } from "../users/password";
import { PublicUser, toPublicUser } from "../users/user.presenter";
import { UsersService } from "../users/users.service";
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./dto/auth.dto";
import { createResetToken, hashResetToken, isResetUsable, resetExpiry } from "./reset-token";

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly users: UsersService,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(APP_ENV) private readonly env: AppEnv,
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

  async requestPasswordReset(input: ForgotPasswordDto) {
    const message = "Si el correo está registrado, ya puedes restablecer la contraseña.";
    const user = await this.users.findByEmailWithSecret(input.email);
    if (!user?.active) {
      return { message };
    }

    const token = createResetToken();
    await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashResetToken(token),
        expiresAt: resetExpiry(),
      },
    });

    if (this.env.exposeResetToken) {
      return { message, resetToken: token };
    }
    return { message };
  }

  async resetPassword(input: ResetPasswordDto) {
    const stored = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(input.token) },
    });
    if (!stored || !isResetUsable(stored)) {
      throw new BadRequestException("El código no es válido o ya venció.");
    }

    const passwordHash = await hashPassword(input.password);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
    ]);
    return { message: "Contraseña actualizada. Ya puedes entrar." };
  }

  private issue(user: PublicUser) {
    return {
      accessToken: this.jwt.sign({ sub: user.id }),
      user,
    };
  }
}
