import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTooManyRequestsResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiBearerAuth,
  ApiUnprocessableEntityResponse,
  ApiNoContentResponse,
  ApiAcceptedResponse,
} from '@nestjs/swagger';

import { ERROR_CODES } from '../exceptions/error-codes';
import { ApiErrorResponseBody } from '../responses/api-error-response';

// Enum for better type safety
enum AuthType {
  COOKIE = 'cookie',
  BEARER = 'bearer',
  NONE = 'none',
}

// Enum for error types to make it more maintainable
enum ErrorType {
  BAD_REQUEST = 'badRequest',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'notFound',
  CONFLICT = 'conflict',
  UNPROCESSABLE_ENTITY = 'unprocessableEntity',
  TOO_MANY_REQUESTS = 'tooManyRequests',
  INTERNAL_SERVER_ERROR = 'internalServerError',
}

// Custom error message interface
interface CustomErrorMessage {
  code?: ERROR_CODES;
  message?: string;
  details?: any;
}

// More comprehensive options interface
interface StandardDocsOptions {
  summary: string;
  description?: string;
  type?: Type<any> | [Type<any>] | string;
  status?: HttpStatus;
  auth?: AuthType | boolean; // Support multiple auth types
  successMessage?: string;
  includeErrors?: ErrorType[]; // Allow selective error responses
  excludeErrors?: ErrorType[]; // Allow excluding specific errors
  customResponses?: any[]; // Allow additional custom responses
  deprecated?: boolean;
  tags?: string[];
  errorMessages?: {
    [ErrorType.BAD_REQUEST]?: CustomErrorMessage;
    [ErrorType.UNAUTHORIZED]?: CustomErrorMessage;
    [ErrorType.FORBIDDEN]?: CustomErrorMessage;
    [ErrorType.NOT_FOUND]?: CustomErrorMessage;
    [ErrorType.CONFLICT]?: CustomErrorMessage;
    [ErrorType.UNPROCESSABLE_ENTITY]?: CustomErrorMessage;
    [ErrorType.TOO_MANY_REQUESTS]?: CustomErrorMessage;
    [ErrorType.INTERNAL_SERVER_ERROR]?: CustomErrorMessage;
  };
}

// Default errors to include (can be overridden)
const DEFAULT_ERRORS = [
  ErrorType.BAD_REQUEST,
  ErrorType.UNAUTHORIZED,
  ErrorType.FORBIDDEN,
  ErrorType.NOT_FOUND,
  ErrorType.INTERNAL_SERVER_ERROR,
];

// Improved error example builder with better typing
const buildErrorExample = (message: string, code: string, details?: any) => ({
  success: false,
  message,
  data: null,
  error: {
    code,
    reason: message,
    details: details || undefined,
  },
  timestamp: new Date().toISOString(),
});

// Success response builder
const buildSuccessExample = (message: string, data: any = {}) => ({
  success: true,
  message,
  data,
  error: null,
  timestamp: new Date().toISOString(),
});

// Error response configurations
const ERROR_RESPONSES = {
  [ErrorType.BAD_REQUEST]: {
    decorator: ApiBadRequestResponse,
    description: 'Invalid input or request parameters',
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'Invalid request payload',
  },
  [ErrorType.UNAUTHORIZED]: {
    decorator: ApiUnauthorizedResponse,
    description: 'Authentication required or invalid credentials',
    code: ERROR_CODES.UNAUTHORIZED,
    message: 'Authentication required',
  },
  [ErrorType.FORBIDDEN]: {
    decorator: ApiForbiddenResponse,
    description: 'Insufficient permissions to access resource',
    code: ERROR_CODES.FORBIDDEN,
    message: 'Access forbidden',
  },
  [ErrorType.NOT_FOUND]: {
    decorator: ApiNotFoundResponse,
    description: 'Requested resource not found',
    code: ERROR_CODES.NOT_FOUND,
    message: 'Resource not found',
  },
  [ErrorType.CONFLICT]: {
    decorator: ApiConflictResponse,
    description: 'Resource conflict or duplicate entry',
    code: ERROR_CODES.CONFLICT,
    message: 'Resource conflict',
  },
  [ErrorType.UNPROCESSABLE_ENTITY]: {
    decorator: ApiUnprocessableEntityResponse,
    description: 'Request validation failed',
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'Validation failed',
  },
  [ErrorType.TOO_MANY_REQUESTS]: {
    decorator: ApiTooManyRequestsResponse,
    description: 'Rate limit exceeded',
    code: ERROR_CODES.TOO_MANY_REQUESTS,
    message: 'Too many requests',
  },
  [ErrorType.INTERNAL_SERVER_ERROR]: {
    decorator: ApiInternalServerErrorResponse,
    description: 'Internal server error',
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: 'Internal server error occurred',
  },
};

export function StandardDocs(options: StandardDocsOptions) {
  const {
    summary,
    description,
    type,
    status = HttpStatus.OK,
    auth = true,
    successMessage,
    includeErrors,
    excludeErrors = [],
    customResponses = [],
    deprecated = false,
    tags = [],
    errorMessages = {},
  } = options;

  const message = successMessage || getDefaultSuccessMessage(status);

  // Determine which errors to include
  const errorsToInclude = includeErrors || DEFAULT_ERRORS;
  const finalErrors = errorsToInclude.filter(
    (error) => !excludeErrors.includes(error),
  );

  // Build decorators array
  const decorators = [
    ApiOperation({
      summary,
      description: description || summary,
      deprecated,
      tags: tags.length > 0 ? tags : undefined,
    }),
  ];

  // Add authentication decorators
  if (auth) {
    if (auth === true || auth === AuthType.COOKIE) {
      decorators.push(ApiCookieAuth());
    } else if (auth === AuthType.BEARER) {
      decorators.push(ApiBearerAuth());
    }
  }

  // Add success response decorator
  decorators.push(getSuccessResponseDecorator(status, message, type));

  // Add error response decorators
  finalErrors.forEach((errorType) => {
    const errorConfig = ERROR_RESPONSES[errorType];
    const customError = errorMessages[errorType];

    if (errorConfig) {
      const errorMessage = customError?.message || errorConfig.message;
      const errorDetails = customError?.details;
      const errorCode = customError?.code || errorConfig.code;

      decorators.push(
        errorConfig.decorator({
          description: errorConfig.description,
          type: ApiErrorResponseBody,
          schema: {
            example: buildErrorExample(errorMessage, errorCode, errorDetails),
          },
        }),
      );
    }
  });

  // Add custom responses
  decorators.push(...customResponses);

  return applyDecorators(...decorators);
}

// Helper function to get appropriate success response decorator
function getSuccessResponseDecorator(
  status: HttpStatus,
  message: string,
  type?: any,
) {
  const commonOptions = {
    description: message,
    ...(type && { type }),
    schema: {
      example: buildSuccessExample(message),
    },
  };

  switch (status) {
    case HttpStatus.CREATED:
      return ApiCreatedResponse(commonOptions);
    case HttpStatus.NO_CONTENT:
      return ApiNoContentResponse({ description: message });
    case HttpStatus.ACCEPTED:
      return ApiAcceptedResponse(commonOptions);
    default:
      return ApiOkResponse(commonOptions);
  }
}

// Helper function to get default success message based on status
function getDefaultSuccessMessage(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.CREATED:
      return 'Resource created successfully';
    case HttpStatus.NO_CONTENT:
      return 'Operation completed successfully';
    case HttpStatus.ACCEPTED:
      return 'Request accepted for processing';
    default:
      return 'Operation completed successfully';
  }
}

// Export types and enums for use in other files
export { AuthType, ErrorType, StandardDocsOptions };
