import { HttpStatus } from '@nestjs/common';
import { AppException } from './app-exception';
import { ERROR_CODES } from './error-codes';
import { RESPONSE_MESSAGES } from '../responses/response-messages';

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

export class NotFoundException extends AppException<unknown | undefined> {
  constructor({
    details,
    reason = 'Resource not found',
  }: {
    details?: unknown;
    reason: string;
  }) {
    super(
      {
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        reason,
        details,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class BadRequestException extends AppException<unknown | undefined> {
  constructor({
    details,
    reason = 'Bad request',
  }: {
    details?: unknown;
    reason: string;
  }) {
    super(
      {
        code: ERROR_CODES.BAD_REQUEST,
        reason,
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class TooManyRequestsException extends AppException<unknown> {
  constructor(details?: unknown) {
    super(
      {
        code: ERROR_CODES.TOO_MANY_ATTEMPTS,
        reason: RESPONSE_MESSAGES.RateLimit,
        details,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
