import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from './error-codes';

export interface AppErrorShape<TDetails = undefined> {
  code: ERROR_CODES | string;
  reason: string;
  details?: TDetails;
}

export class AppException<TDetails = undefined> extends HttpException {
  public readonly code: string | keyof ERROR_CODES;
  public readonly reason: string;
  public readonly details?: TDetails;

  constructor(
    { code, reason, details }: AppErrorShape<TDetails>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        success: false,
        message: reason,
        data: null,
        error: {
          code,
          reason,
          details,
        },
      },
      status,
    );

    this.code = code;
    this.reason = reason;
    this.details = details;
  }
}
