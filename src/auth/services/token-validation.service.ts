import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from '../../lib/logger/logger.service';
import { Request } from 'express';
import { COOKIE_CONSTANTS, JWT_CONSTANTS } from '../constants';
import { AuthTokenPayload, SessionData } from '../interfaces/auth.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ITokenValidationService } from '../interfaces/token-validation.inteface';
import { IRedisCacheService } from '../../lib/redis/redis.interface';
import { getSessionKey } from '../auth.utils';

@Injectable()
export class TokenValidationService implements ITokenValidationService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly jwtService: JwtService,
    @Inject('IRedisCacheService')
    private readonly redisCacheService: IRedisCacheService,
  ) {
    this.logger.setContext(TokenValidationService.name);
  }

  private async getSessionFromCookies(
    req: Request,
  ): Promise<SessionData | null> {
    this.logger.debug('Validation got here method:GetsessionFromCookies');
    const sessionId = req.cookies[COOKIE_CONSTANTS.sessionId];

    this.logger.debug(
      'Logging session id from getsessio from cookies',
      sessionId,
    );

    if (!sessionId) return null;

    const sessionKey = getSessionKey(sessionId);

    this.logger.debug(
      'Logging session key from getsessio from cookies',
      sessionKey,
    );

    const session =
      await this.redisCacheService.getTypedHashFields<SessionData>(sessionKey);

    this.logger.debug('got here after session');
    console.log(session);

    if (!session) return null;

    return session;
  }

  private async validateTokenAgainstSession(
    token: string,
    expectedToken: string,
    secret: string,
    sessionUserId: string,
  ): Promise<AuthTokenPayload | null> {
    this.logger.log(
      'Validation got here method:validate token agains sesson ',
      expectedToken,
    );

    if (token !== expectedToken) return null;

    const payload = await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
      secret,
    });
    return payload.id === sessionUserId ? payload : null;
  }

  public async validateAccessToken(req: Request): Promise<boolean> {
    try {
      const token = req.cookies[COOKIE_CONSTANTS.accessToken];
      if (!token) return false;

      const session = await this.getSessionFromCookies(req);

      if (!session) return false;

      const payload = await this.validateTokenAgainstSession(
        token,
        session.access_token,
        JWT_CONSTANTS.accessSecret,
        session.user_id,
      );

      if (!payload) return false;

      const sessionId = req.cookies[COOKIE_CONSTANTS.sessionId];

      req.user = payload;
      req.session_id = sessionId;
      return true;
    } catch (error) {
      this.logger.error(
        `Access token validation failed: ${error.message}`,
        error,
      );
      return false;
    }
  }

  public async validateRefreshToken(req: Request): Promise<boolean> {
    try {
      const token = req.cookies[COOKIE_CONSTANTS.refreshToken];
      if (!token) return false;

      const session = await this.getSessionFromCookies(req);
      if (!session) return false;

      const payload = await this.validateTokenAgainstSession(
        token,
        session.refresh_token,
        JWT_CONSTANTS.refreshSecret,
        session.user_id,
      );

      if (!payload) return false;

      const sessionId = req.cookies[COOKIE_CONSTANTS.sessionId];

      req.user = payload;
      req.session_id = sessionId;
      return true;
    } catch (error) {
      this.logger.error(
        `Refresh token validation failed: ${error.message}`,
        error,
      );
      return false;
    }
  }
}
