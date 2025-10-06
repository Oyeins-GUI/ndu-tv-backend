import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthTokens, IAuthService } from '../interfaces/auth.interface';
import { env } from '../../config';
import { Response, Request } from 'express';
import { COOKIE_CONSTANTS } from '../constants';
import {
  ChangePasswordConfirmRequestBody,
  ChangePasswordInitRequestBody,
  LoginRequestBody,
  PasswordConfirmRequestBody,
  SetPasswordInitRequestBody,
} from '../dtos/auth.request.dto';
import { AdminApiResponse } from '../../modules/admin/dtos/admin.reponse.dto';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import {
  ChangePasswordEndpoint,
  InitChangePasswordEndpoint,
  InitResetPasswordEndpoint,
  InitSetPasswordEndpoint,
  LoginEndpoint,
  LogoutEndpoint,
  MeEndpoint,
  RefreshTokenEndpoint,
  ResetPasswordEndpoint,
  SetPasswordConfirmEndpoint,
} from '../decorators/auth.decorator';
import { SuccessResponseBody } from '../../shared/responses/success-response';
import { RefreshTokenGuard } from '../gaurds/refresh.guard';

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
      sameSite:
        env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
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
    const data = await this.authService.login(
      body.identifier,
      body.password,
      body.remember_me,
    );
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

  @Post('refresh')
  @RefreshTokenEndpoint()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { id } = req.user;
    const data = await this.authService.refreshToken(id, req.session_id);
    this.setAuthCookies(
      res,
      data.tokens,
      data.session_id,
      COOKIE_CONSTANTS.defaultMaxAge,
    );

    const result = new AdminApiResponse(
      data.admin,
      RESPONSE_MESSAGES.Auth.Success.TokenRefreshed,
    );

    res.json(result);
    return result;
  }

  @Post('me')
  @MeEndpoint()
  public async me(@Req() req: Request): Promise<AdminApiResponse> {
    const user = await this.authService.getUser(req.user?.id!);
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

  @Post('password/change/init')
  @InitChangePasswordEndpoint()
  public async initChangePassword(
    @Req() req: Request,
    @Body() body: ChangePasswordInitRequestBody,
  ): Promise<SuccessResponseBody> {
    await this.authService.initChangePassword(req.user?.id, body.old_password);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.OtpSent,
    });
  }

  @Post('password/change/confirm')
  @ChangePasswordEndpoint()
  public async changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChangePasswordConfirmRequestBody,
  ): Promise<SuccessResponseBody> {
    await this.authService.changePassword(
      req.user?.id,
      body.otp,
      body.new_password,
    );

    res.clearCookie(COOKIE_CONSTANTS.sessionId);
    res.clearCookie(COOKIE_CONSTANTS.accessToken);
    res.clearCookie(COOKIE_CONSTANTS.refreshToken);

    const result = new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.PasswordChange,
    });

    res.json(result);
    return result;
  }

  @Post('password/reset/init')
  @InitResetPasswordEndpoint()
  public async initResetPassword(
    @Body() body: SetPasswordInitRequestBody,
  ): Promise<SuccessResponseBody> {
    this.authService.initiateResetPassword(body.email, body.matric_number);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.SentPasswordSetLink,
    });
  }

  @Post('password/reset/confirm')
  @ResetPasswordEndpoint()
  public async resetPassword(
    @Body() body: PasswordConfirmRequestBody,
  ): Promise<SuccessResponseBody> {
    await this.authService.resetPassword(body.token, body.password);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Auth.Success.PasswordReset,
    });
  }

  @Post('password/set/init')
  @InitSetPasswordEndpoint()
  public async initSetPassword(
    @Body() body: SetPasswordInitRequestBody,
  ): Promise<SuccessResponseBody> {
    this.authService.initiateSetPassword(body.email, body.matric_number);
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
