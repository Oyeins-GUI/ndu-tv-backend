import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import { AdminApiResponse } from '../../modules/admin/dtos/admin.reponse.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { SuccessResponseBody } from '../../shared/responses/success-response';
import { RateLimit } from '../../shared/decorators/user-rate-limit.decorator';

export function LoginEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Logs in an admin (user)',
      successMessage: RESPONSE_MESSAGES.Auth.Success.Login,
      includeErrors: [ErrorType.BAD_REQUEST, ErrorType.INTERNAL_SERVER_ERROR],
      type: AdminApiResponse,
      status: HttpStatus.OK,
      auth: false,
    }),
  );
}

export function MeEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Checks current user session',
      successMessage: RESPONSE_MESSAGES.Auth.Success.LoggedIn,
      includeErrors: [ErrorType.BAD_REQUEST, ErrorType.INTERNAL_SERVER_ERROR],
      type: AdminApiResponse,
      status: HttpStatus.OK,
    }),
  );
}

export function LogoutEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Logs out an admin (user)',
      successMessage: RESPONSE_MESSAGES.Auth.Success.Logout,
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.UNAUTHORIZED,
      ],
      type: SuccessResponseBody,
      status: HttpStatus.OK,
    }),
  );
}

export function InitSetPasswordEndpoint() {
  return applyDecorators(
    Public(),
    RateLimit(3600 * 24, 1),
    StandardDocs({
      summary:
        'Initialize password set and account activation process for new admin',
      successMessage: RESPONSE_MESSAGES.Auth.Success.SentPasswordSetLink,
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.TOO_MANY_REQUESTS,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      auth: false,
      type: SuccessResponseBody,
      status: HttpStatus.OK,
    }),
  );
}

export function SetPasswordConfirmEndpoint() {
  return applyDecorators(
    Public(),
    RateLimit(3600 * 24, 1),
    StandardDocs({
      summary:
        'Confirm set password with token and email, sets the password and logs in the admin',
      successMessage: RESPONSE_MESSAGES.Auth.Success.PasswordSet,
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.TOO_MANY_REQUESTS,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      auth: false,
      type: AdminApiResponse,
      status: HttpStatus.OK,
    }),
  );
}
