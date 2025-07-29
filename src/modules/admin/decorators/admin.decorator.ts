import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  AdminApiResponse,
  SugExecutiveApiResponse,
} from '../dtos/admin.reponse.dto';

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
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Created,
      status: HttpStatus.CREATED,
      type: SugExecutiveApiResponse,
    }),
  );
}

export function CreateAdminEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add an admin',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Admin.Success.Created,
      status: HttpStatus.CREATED,
      type: AdminApiResponse,
    }),
  );
}
