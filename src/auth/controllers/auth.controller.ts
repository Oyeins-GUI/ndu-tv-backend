import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthTokens, IAuthService } from '../interfaces/auth.interface';
import { env } from '../../config';
import { Response, Request } from 'express';
import { COOKIE_CONSTANTS } from '../constants';
import {
  LoginRequestBody,
  PasswordConfirmRequestBody,
  SetPasswordInitRequestBody,
} from '../dtos/auth.request.dto';
import { AdminApiResponse } from '../../modules/admin/dtos/admin.reponse.dto';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import {
  InitSetPasswordEndpoint,
  LoginEndpoint,
  LogoutEndpoint,
  MeEndpoint,
  SetPasswordConfirmEndpoint,
} from '../decorators/auth.decorator';
import { SuccessResponseBody } from '../../shared/responses/success-response';

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

  @Post('me')
  @MeEndpoint()
  public async me(@Res() req: Request): Promise<AdminApiResponse> {
    const user = await this.authService.getUser(req.user.id!);

    const result = new AdminApiResponse(
      user,
      RESPONSE_MESSAGES.Auth.Success.LoggedIn,
    );

    return result;
  }

  @Post('logout')
  @LogoutEndpoint()
  public async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<SuccessResponseBody> {
    const data = await this.authService.logout(req.session_id);

    res.clearCookie(COOKIE_CONSTANTS.sessionId);
    res.clearCookie(COOKIE_CONSTANTS.accessToken);
    res.clearCookie(COOKIE_CONSTANTS.refreshToken);

    const result = new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.Logout,
    });

    res.json(result);
    return result;
  }

  @Post('password/set/init')
  @InitSetPasswordEndpoint()
  public async initSetPassword(
    @Body() body: SetPasswordInitRequestBody,
  ): Promise<SuccessResponseBody> {
    await this.authService.initiateSetPassword(body.email, body.matric_number);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.SentPasswordSetLink,
    });
  }

  @Post('password/set/confirm')
  @SetPasswordConfirmEndpoint()
  public async setPassword(
    @Res() res: Response,
    @Body() body: PasswordConfirmRequestBody,
  ): Promise<AdminApiResponse> {
    const data = await this.authService.setPassword(body.token, body.password);

    const maxAge = COOKIE_CONSTANTS.defaultMaxAge;

    this.setAuthCookies(res, data.tokens, data.session_id, maxAge);

    const result = new AdminApiResponse(
      data.admin,
      RESPONSE_MESSAGES.Auth.Success.PasswordSet,
    );

    res.json(result);

    return result;
  }
}
