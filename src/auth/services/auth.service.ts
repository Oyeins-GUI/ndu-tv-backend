import { Inject, Injectable } from '@nestjs/common';
import { CustomLogger } from '../../lib/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';
import { IAdminRepository } from '../../modules/admin/repositories/interfaces/admin-repository.interface';
import {
  AuthTokenPayload,
  AuthTokens,
  IAuthService,
  SessionData,
} from '../interfaces/auth.interface';
import {
  BadRequestException,
  InvalidCredentialsException,
  NotFoundException,
  UnauthorizedException,
} from '../../shared/exceptions';
import * as bcrypt from 'bcrypt';
import { JWT_CONSTANTS, SESSION_CONSTANTS } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/auth.dto';
import { IRedisCacheService } from '../../lib/redis/redis.interface';
import { AdminDto } from '../../modules/admin/dtos/admin.dto';
import {
  getSessionKey,
  getTokenKey,
  getUserSessionSetKey,
} from '../auth.utils';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import { env } from '../../config';
import { IEmailService } from '../../lib/email/email.interface';
import { TEMPLATE_NAMES, TEMPLATE_SUBJECTS } from '../../lib/email/templates';
import { generateRandomToken } from '../../lib/utils';
import { mapRoles } from '../../shared/helpers/service.helper';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    @Inject('IRedisCacheService')
    private readonly redisCacheService: IRedisCacheService,
    private readonly jwtService: JwtService,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {
    this.logger.setContext(AuthService.name);
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

  public async getUser(user_id: string): Promise<AdminDto> {
    try {
      const user = await this.adminRepository.findById(user_id);

      return new AdminDto(user!);
    } catch (error) {
      this.logger.logServiceError(this.getUser.name, error);
      throw error;
    }
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

      const sessionId = uuidv4();

      const sessionKey = getSessionKey(sessionId);

      const setKey = getUserSessionSetKey(admin.id);

      const sessionPayload: SessionData = {
        user_id: admin.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };

      await this.adminRepository.updateByModel(admin, {
        last_login_at: new Date(),
      });

      await this.redisCacheService.setHash<SessionData>(
        sessionKey,
        sessionPayload,
        SESSION_CONSTANTS.defaultTTL,
      );

      await this.redisCacheService.addToSet(
        setKey,
        sessionId,
        SESSION_CONSTANTS.defaultTTL * 2,
      );

      return new LoginDto(new AdminDto(admin), tokens, sessionId);
    } catch (error) {
      this.logger.logServiceError(this.login.name, error, { identifier });
      throw error;
    }
  }
  getUserSessionSetKey(id: string) {
    throw new Error('Method not implemented.');
  }

  public async logout(session_id: string): Promise<void> {
    try {
      const sessionKey = getSessionKey(session_id);
      const session =
        await this.redisCacheService.getTypedHashFields<SessionData>(
          sessionKey,
        );
      if (session) {
        await this.redisCacheService.removeFromSet(
          getUserSessionSetKey(session.user_id),
          session_id,
        );
      }
      await this.redisCacheService.delete(sessionKey);
    } catch (error) {
      this.logger.logServiceError(this.logout.name, error);
      throw error;
    }
  }

  public async initiateSetPassword(
    email: string,
    matric_number: string,
  ): Promise<void> {
    try {
      const admin = await this.adminRepository.findBy(
        {
          email,
          matric_number,
        },
        {
          relations: ['all'],
        },
      );

      // if (!admin)
      //   throw new NotFoundException({
      //     reason: RESPONSE_MESSAGES.Admin.Failiure.NotFound,
      //   });

      if (!admin) return;

      if (admin.must_set_password || admin.password)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.Auth.Failure.PasswordSet,
        });

      const payload: { id: string } = {
        id: admin.id,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: JWT_CONSTANTS.accessSecret,
        expiresIn: JWT_CONSTANTS.accessExpiry,
      });

      const randomToken = generateRandomToken();

      const tokenKey = getTokenKey('activate-account', randomToken);

      const ttl = 60 * 60 * 24 * 7; //7 days for token expiry

      await this.redisCacheService.setString(tokenKey, token, ttl);

      await this.emailService.sendMail({
        template: TEMPLATE_NAMES.activateAccount,
        to: admin.email,
        subject: TEMPLATE_SUBJECTS.activateAccount,
        context: {
          name: admin.name,
          role: mapRoles(admin.role.role),
          department: admin.department.department,
          faculty: admin.faculty.faculty,
          action_url: `${env.FRONTEND_URL}/admin/new?token=${randomToken}`,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      this.logger.logServiceError(this.initiateSetPassword.name, error, {
        email,
        matric_number,
      });
      throw error;
    }
  }

  public async setPassword(token: string, password: string): Promise<LoginDto> {
    try {
      const jwtToken = await this.redisCacheService.getStringValue(
        `activate-account:${token}`,
      );

      if (!jwtToken)
        throw new UnauthorizedException({
          reason: RESPONSE_MESSAGES.Auth.Failure.EmptyOrInvalidToken,
        });

      const adminPayload = await this.jwtService.verifyAsync<{ id: string }>(
        jwtToken,
        {
          secret: JWT_CONSTANTS.accessSecret,
        },
      );

      const admin = await this.adminRepository.findById(adminPayload.id, {
        relations: ['all'],
      });

      if (!admin)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Admin.Failiure.NotFound,
        });

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const udpatedAdmin = await this.adminRepository.updateByModel(admin, {
        password: hashedPassword,
        must_set_password: false,
      });

      const payload: AuthTokenPayload = {
        id: udpatedAdmin.id,
        email: udpatedAdmin.email,
      };

      const tokens = await this.generateTokens(payload);

      const sessionId = uuidv4();

      const sessionKey = getSessionKey(sessionId);

      const setKey = getUserSessionSetKey(admin.id);

      const sessionPayload: SessionData = {
        user_id: admin.id,
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
        sessionId,
        SESSION_CONSTANTS.defaultTTL * 2,
      );

      await this.redisCacheService.delete(`activate-account:${token}`);

      return new LoginDto(new AdminDto(admin), tokens, sessionId);
    } catch (error) {
      this.logger.logServiceError(this.setPassword.name, error, {
        token,
      });

      if (
        error.name == 'TokenExpiredError' ||
        error.name == 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException({
          reason: RESPONSE_MESSAGES.Auth.Failure.EmptyOrInvalidToken,
        });
      }
      throw error;
    }
  }
}
