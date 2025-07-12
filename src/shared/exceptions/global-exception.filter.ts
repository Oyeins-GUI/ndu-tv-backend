import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';

import { AppException } from './app-exception';
import { CustomLogger } from '../../lib/logger/logger.service';
import { ERROR_CODES } from './error-codes';
import { env } from '../../config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let reason = 'Internal Server Error';
    let details: any = undefined;

    if (exception instanceof AppException) {
      statusCode = exception.getStatus();
      code = exception.code as any;
      reason = exception.reason;
      details = exception.details;
    }

    // if (exception instanceof ThrottlerException) {
    //   statusCode = HttpStatus.TOO_MANY_REQUESTS;
    //   code = ERROR_CODES.TOO_MANY_REQUESTS;
    //   reason = 'Too many requests';
    // }

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        reason = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as any;

        if (
          Array.isArray(r.message) &&
          r.message.every((msg: any) => msg?.property && msg?.constraints)
        ) {
          statusCode = HttpStatus.BAD_REQUEST;
          code = ERROR_CODES.VALIDATION_ERROR;
          reason = 'Validation failed';
          details = this.formatValidationErrors(r.message);
        } else if (Array.isArray(r.message)) {
          code = ERROR_CODES.BAD_REQUEST;
          reason = r.error || 'Bad Request';
          details = r.message.map((msg: string) => ({ message: msg }));
        } else {
          reason = r.message || r.error || reason;
        }
      }
    }

    if (exception instanceof ValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      code = ERROR_CODES.VALIDATION_ERROR;
      reason = 'Validation failed';
      details = this.formatValidationErrors([exception]);
    }

    if (exception instanceof Error) {
      reason = exception.message;
    }

    if (
      statusCode === HttpStatus.BAD_REQUEST &&
      code === ERROR_CODES.INTERNAL_SERVER_ERROR
    ) {
      code = ERROR_CODES.BAD_REQUEST;
    }

    if (statusCode > 400 && statusCode < 500) {
      code = ERROR_CODES.NOT_FOUND;
    }

    const logMsg = `${request.method} ${request.url} - ${statusCode} - ${reason}`;
    if (statusCode >= 500) {
      this.logger.error(
        logMsg,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(logMsg);
    }

    const body = {
      success: false,
      message: reason,
      data: null,
      error: {
        code,
        reason,
        ...(details !== undefined ? { details } : {}),
      },
      ...(env.NODE_ENV === 'development' && {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      }),
    };

    httpAdapter.reply(response, body, statusCode);
  }

  private formatValidationErrors(errors: ValidationError[]) {
    return errors.flatMap((error) =>
      error.constraints
        ? Object.values(error.constraints).map((msg) => ({
            field: error.property,
            message: msg,
          }))
        : [],
    );
  }
}
