import { HttpStatus } from '@nestjs/common';
import { AppException } from './app-exception';
import { ERROR_CODES } from './error-codes';

type ValidationFieldError = {
  field: string;
  message: string;
};

export class ValidationException extends AppException<ValidationFieldError[]> {
  constructor(details: ValidationFieldError[], reason = 'Validation failed') {
    super(
      {
        code: ERROR_CODES.VALIDATION_ERROR,
        reason,
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

// export class TooManyRequestsException extends AppException<unknown> {
//   constructor(details?: unknown) {
//     super(
//       {
//         code: ERROR_CODES.TOO_MANY_ATTEMPTS,
//         reason: RESPONSE_MESSAGES.Auth.Failure.TooManyAttempts,
//         details,
//       },
//       HttpStatus.TOO_MANY_REQUESTS,
//     );
//   }
// }
