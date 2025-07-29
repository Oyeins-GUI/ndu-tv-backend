import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthTokens, IAuthService } from '../interfaces/auth.interface';
import { env } from '../../config';
import { Response } from 'express';
import { COOKIE_CONSTANTS } from '../constants';
import { LoginRequestBody } from '../dtos/auth.request.dto';
import { AdminApiResponse } from '../../modules/admin/dtos/admin.reponse.dto';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import { LoginEndpoint } from '../decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  private setAuthCookies(
    res: Response,
    tokens: AuthTokens,
    session_id: string,
    maxAge: {
      accessToken: number;
      refreshToken: number;
    },
  ): void {
    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    res.cookie(COOKIE_CONSTANTS.accessToken, tokens.access_token, {
      ...cookieOptions,
      maxAge: maxAge.accessToken,
    });

    res.cookie(COOKIE_CONSTANTS.refreshToken, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: maxAge.refreshToken,
    });

    res.cookie(COOKIE_CONSTANTS.sessionId, session_id, {
      ...cookieOptions,
      maxAge: maxAge.refreshToken,
    });
  }

  @Post('login')
  @LoginEndpoint()
  public async login(
    @Res() res: Response,
    @Body() body: LoginRequestBody,
  ): Promise<AdminApiResponse> {
    const data = await this.authService.login(body.identifier, body.password);
    const maxAge = body.remember_me
      ? COOKIE_CONSTANTS.rememberMaxAge
      : COOKIE_CONSTANTS.defaultMaxAge;

    this.setAuthCookies(res, data.tokens, data.session_id, maxAge);

    const result = new AdminApiResponse(
      data.admin,
      RESPONSE_MESSAGES.Auth.Success.Login,
    );

    res.json(result);
    return result;
  }
}
