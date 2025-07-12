import { HttpStatus } from '@nestjs/common';
import { AppException, AppErrorShape } from './app-exception';
import { ERROR_CODES } from './error-codes';

export class UserNotFoundException extends AppException<unknown> {
  constructor(details?: unknown) {
    super(
      {
        code: ERROR_CODES.USER_NOT_FOUND,
        reason: 'User does not exist',
        details,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
