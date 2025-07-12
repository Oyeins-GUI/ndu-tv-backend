import { HttpStatus } from '@nestjs/common';
import { AppException } from './app-exception';
import { ERROR_CODES } from './error-codes';

export class InvalidCredentialsException extends AppException<string[]> {
  constructor(details?: string[], message?: string) {
    super(
      {
        code: ERROR_CODES.INVALID_CREDENTIALS,
        reason: message || 'Invalid credentials',
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
