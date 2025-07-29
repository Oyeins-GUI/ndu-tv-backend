import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import { AdminApiResponse } from '../../modules/admin/dtos/admin.reponse.dto';

export function LoginEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Logs in an admin',
      successMessage: RESPONSE_MESSAGES.Auth.Success.Login,
      includeErrors: [ErrorType.BAD_REQUEST, ErrorType.INTERNAL_SERVER_ERROR],
      type: AdminApiResponse,
      status: HttpStatus.OK,
    }),
  );
}
