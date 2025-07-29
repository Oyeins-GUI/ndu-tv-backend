import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SugExecutiveApiResponse } from '../dtos/admin.reponse.dto';

export function CreateSugExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add an sug Executive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Created,
      status: HttpStatus.CREATED,
      type: SugExecutiveApiResponse,
    }),
  );
}
