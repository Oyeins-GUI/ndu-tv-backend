import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../lib/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';
import { IAdminRepository } from '../../modules/admin/interfaces/admin-repository.interface';
import {
  AuthTokenPayload,
  AuthTokens,
  IAuthService,
  SessionData,
} from '../interfaces/auth.interface';
import { InvalidCredentialsException } from '../../shared/exceptions';
import * as bcrypt from 'bcrypt';
import { JWT_CONSTANTS, SESSION_CONSTANTS } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/auth.dto';
import { IRedisCacheService } from '../../lib/redis/redis.interface';
import { AdminDto } from '../../modules/admin/dtos/admin.dto';

export class AuthService implements IAuthService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    @Inject('IRedisCacheService')
    private readonly redisCacheService: IRedisCacheService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  private getSessionKey(session_id: string): string {
    return `session:${session_id}`;
  }

  private getUserSessionSetKey(user_id: string): string {
    return `admin-sessions:${user_id}`;
  }

  private async generateTokens(
    payload: AuthTokenPayload,
    expires_in?: {
      access: string;
      refresh: string;
    },
  ): Promise<AuthTokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT_CONSTANTS.accessSecret,
        expiresIn: expires_in ? expires_in.access : JWT_CONSTANTS.accessExpiry,
      }),

      this.jwtService.signAsync(payload, {
        secret: JWT_CONSTANTS.refreshSecret,
        expiresIn: expires_in
          ? expires_in.refresh
          : JWT_CONSTANTS.refreshExpiry,
      }),
    ]);

    return { access_token, refresh_token };
  }

  public async login(identifier: string, password: string): Promise<LoginDto> {
    try {
      const admin =
        await this.adminRepository.findActiveVerifiedByIdentifier(identifier);

      if (!admin) throw new InvalidCredentialsException();

      const result = await bcrypt.compare(password, admin.password!);

      if (!result) throw new InvalidCredentialsException();

      const payload: AuthTokenPayload = {
        id: admin.id,
        email: admin.email,
      };

      const tokens = await this.generateTokens(payload);

      const session_id = uuidv4();

      const sessionKey = this.getSessionKey(session_id);

      const setKey = this.getUserSessionSetKey(admin.id);

      const sessionPayload: SessionData = {
        admin_id: admin.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };

      await this.redisCacheService.setHash<SessionData>(
        sessionKey,
        sessionPayload,
        SESSION_CONSTANTS.defaultTTL,
      );

      await this.redisCacheService.addToSet(
        setKey,
        session_id,
        SESSION_CONSTANTS.defaultTTL * 2,
      );

      return new LoginDto(new AdminDto(admin), tokens, session_id);
    } catch (error) {
      this.logger.logServiceError(this.login.name, error, { identifier });
      throw error;
    }
  }

  public async logout(session_id: string): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(session_id);
      const session =
        await this.redisCacheService.getTypedHashFields<SessionData>(
          sessionKey,
        );
      if (session) {
        await this.redisCacheService.removeFromSet(
          this.getUserSessionSetKey(session.admin_id),
          session_id,
        );
      }
      await this.redisCacheService.delete(sessionKey);
    } catch (error) {
      this.logger.logServiceError(this.logout.name, error);
      throw error;
    }
  }
}
