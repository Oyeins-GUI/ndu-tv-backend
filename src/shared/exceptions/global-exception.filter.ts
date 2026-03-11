import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  DatabaseError,
  ValidationError as SequelizeValidationError,
} from 'sequelize';
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

    // Safe defaults
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string | ERROR_CODES = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let reason = 'Internal Server Error';
    let details: any = undefined;

    if (exception instanceof AppException) {
      statusCode = exception.getStatus();
      code = exception.code;
      reason = exception.reason;
      details = exception.details;
    } else if (exception instanceof SequelizeValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      code = ERROR_CODES.VALIDATION_ERROR;
      reason = 'Database Input Validation failed';
      details = exception.errors.map((e) => {
        this.logger.error(e.message);
        return { field: e.path, message: e.message };
      });
    } else if (exception instanceof DatabaseError) {
      statusCode = HttpStatus.BAD_REQUEST;
      this.logger.error(exception.message);
      if (exception.message.includes('invalid input syntax for type uuid')) {
        code = ERROR_CODES.VALIDATION_ERROR;
        reason = 'Invalid UUID format provided';
        details = [{ message: exception.message }];
      } else {
        code = ERROR_CODES.BAD_REQUEST;
        reason = 'Database validation error';
        details = [{ message: exception.message }];
      }
    } else if (exception instanceof HttpException) {
      // NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        reason = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        reason = (exceptionResponse as any).message ?? exception.message;
        // class-validator errors come as an array in message
        if (Array.isArray(reason)) {
          details = reason;
          reason = 'Validation failed';
        }
      }
      code = ERROR_CODES.BAD_REQUEST;
    } else if (exception instanceof Error) {
      // Unhandled errors — keep 500 defaults, just use the message
      reason = exception.message;
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
      ...((env.NODE_ENV === 'development' || env.NODE_ENV === 'staging') && {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      }),
    };

    httpAdapter.reply(response, body, statusCode);
  }
}
