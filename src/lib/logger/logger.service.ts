// import {
//   ConsoleLogger,
//   Injectable,
//   LoggerService,
//   Scope,
// } from '@nestjs/common';
// import * as winston from 'winston';
// import 'winston-daily-rotate-file';

// @Injectable({ scope: Scope.TRANSIENT })
// export class CustomLogger extends ConsoleLogger implements LoggerService {
//   private readonly winstonLogger: winston.Logger;

//   constructor(context?: string) {
//     // Call the parent (ConsoleLogger) constructor to inherit default NestJS console logging behavior.
//     // This allows NestJS to automatically set the context (e.g., 'AppService')
//     super(context || '');

//     this.winstonLogger = winston.createLogger({
//       level: 'info', // Default minimum level for logs to be processed by Winston
//       format: winston.format.combine(
//         winston.format.timestamp(), // Adds a timestamp to each log entry
//         winston.format.json(), // Formats the log output as JSON for machine readability
//       ),
//       transports: [
//         // 1. Console Transport: For human-readable output in your terminal during development
//         new winston.transports.Console({
//           format: winston.format.combine(
//             winston.format.colorize(), // Adds colors to log levels (e.g., INFO in green)
//             winston.format.simple(), // Simple format (e.g., "INFO: My message")
//           ),
//           level: 'silly', // IMPORTANT: Shows all log levels (even 'debug', 'silly') on the console for dev
//         }),
//         // 2. File Transport (using winston-daily-rotate-file): For structured JSON logs written to files
//         new winston.transports.DailyRotateFile({
//           filename: 'logs/application-%DATE%.log', // Log file path, e.g., 'logs/application-2025-06-11.log'
//           datePattern: 'YYYY-MM-DD', // Rotates logs daily
//           zippedArchive: true, // Compresses old log files (.gz)
//           maxSize: '20m', // Maximum size of each log file before rotation
//           maxFiles: '14d', // Retain logs for 14 days, then delete older ones
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.json(), // Crucially, use JSON format for file logs (for Promtail/Loki)
//           ),
//         }),
//       ],
//     });
//   }

//   // Override NestJS LoggerService methods to delegate to Winston
//   // These methods will be called by NestJS when you use its Logger (e.g., new Logger(MyService.name))
//   log(message: any, context?: string) {
//     this.winstonLogger.info(message, { context: context || this.context });
//   }

//   error(message: any, trace?: string, context?: string) {
//     this.winstonLogger.error(message, {
//       trace,
//       context: context || this.context,
//     });
//   }

//   warn(message: any, context?: string) {
//     this.winstonLogger.warn(message, { context: context || this.context });
//   }

//   debug(message: any, context?: string) {
//     this.winstonLogger.debug(message, { context: context || this.context });
//   }

//   verbose(message: any, context?: string) {
//     this.winstonLogger.verbose(message, { context: context || this.context });
//   }

//   // You can also override setContext if you need custom logic there, but it's optional
//   setContext(context: string) {
//     super.setContext(context);
//   }

//   logServiceError(
//     method: string,
//     error: unknown,
//     context: Record<string, any> = {},
//   ) {
//     const message = `[${method}] ${error instanceof Error ? error.message : String(error)}`;
//     const trace = error instanceof Error ? error.stack : undefined;

//     this.error(message, trace, JSON.stringify(context));
//   }
// }

// import {
//   ConsoleLogger,
//   Injectable,
//   LoggerService,
//   Scope,
// } from '@nestjs/common';
// import * as winston from 'winston';
// import 'winston-daily-rotate-file';
// import { inspect } from 'util';

// @Injectable({ scope: Scope.TRANSIENT })
// export class CustomLogger extends ConsoleLogger implements LoggerService {
//   private readonly winstonLogger: winston.Logger;

//   constructor(context?: string) {
//     super(context || '');

//     this.winstonLogger = winston.createLogger({
//       level: 'info',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.errors({ stack: true }),
//         winston.format.json(),
//       ),
//       transports: [
//         new winston.transports.Console({
//           format: winston.format.combine(
//             winston.format.colorize(),
//             winston.format.printf(
//               ({
//                 level,
//                 message,
//                 timestamp,
//                 context,
//                 trace,
//                 stack,
//                 ...meta
//               }) => {
//                 // Format the main message - handle objects properly
//                 let formattedMessage = message;
//                 if (typeof message === 'object' && message !== null) {
//                   formattedMessage = inspect(message, {
//                     depth: null,
//                     colors: true,
//                     maxArrayLength: null,
//                     breakLength: 80,
//                     compact: false,
//                   });
//                 }

//                 let log = `${timestamp} ${level} ${context ? `[${context}]` : ''} ${formattedMessage}`;

//                 // Remove known fields from meta to avoid duplication
//                 const { error, method, ...restMeta } = meta;

//                 // Show additional metadata if present
//                 if (Object.keys(restMeta).length > 0) {
//                   log += `\n${inspect(restMeta, {
//                     depth: null,
//                     colors: true,
//                     maxArrayLength: null,
//                     breakLength: 80,
//                     compact: false,
//                   })}`;
//                 }

//                 // Show error details if present
//                 if (error) {
//                   log += `\n${inspect(error, {
//                     depth: null,
//                     colors: true,
//                     maxArrayLength: null,
//                     breakLength: 80,
//                     compact: false,
//                   })}`;
//                 }

//                 // Show stack trace if present (either from trace or stack)
//                 const stackTrace = trace || stack;
//                 if (stackTrace) {
//                   log += `\n${stackTrace}`;
//                 }

//                 return log;
//               },
//             ),
//           ),
//           level: 'silly',
//         }),
//         new winston.transports.DailyRotateFile({
//           filename: 'logs/application-%DATE%.log',
//           datePattern: 'YYYY-MM-DD',
//           zippedArchive: true,
//           maxSize: '20m',
//           maxFiles: '14d',
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.errors({ stack: true }),
//             // Custom formatter to handle objects properly in JSON logs
//             winston.format.printf((info) => {
//               // Ensure objects are properly serialized, not converted to [object Object]
//               const formattedInfo = { ...info };

//               // If message is an object, keep it as is (JSON.stringify will handle it)
//               if (typeof info.message === 'object' && info.message !== null) {
//                 formattedInfo.message = info.message;
//               }

//               return JSON.stringify(formattedInfo);
//             }),
//           ),
//         }),
//       ],
//     });
//   }

//   /**
//    * Helper to normalize messages - handles objects, arrays, and primitives
//    */
//   private normalizeMessage(message: any): any {
//     // If it's already a primitive or null, return as-is
//     if (message === null || typeof message !== 'object') {
//       return message;
//     }

//     // For objects and arrays, return them directly so Winston can handle them
//     return message;
//   }

//   log(message: any, context?: string) {
//     const logContext = context || this.context;
//     const normalizedMessage = this.normalizeMessage(message);

//     this.winstonLogger.info(normalizedMessage, { context: logContext });
//   }

//   error(message: any, trace?: string, context?: string) {
//     const logContext = context || this.context;
//     const normalizedMessage = this.normalizeMessage(message);

//     this.winstonLogger.error(normalizedMessage, {
//       trace,
//       context: logContext,
//     });
//   }

//   warn(message: any, context?: string) {
//     const logContext = context || this.context;
//     const normalizedMessage = this.normalizeMessage(message);

//     this.winstonLogger.warn(normalizedMessage, { context: logContext });
//   }

//   debug(message: any, context?: string) {
//     const logContext = context || this.context;
//     const normalizedMessage = this.normalizeMessage(message);

//     this.winstonLogger.debug(normalizedMessage, { context: logContext });
//   }

//   verbose(message: any, context?: string) {
//     const logContext = context || this.context;
//     const normalizedMessage = this.normalizeMessage(message);

//     this.winstonLogger.verbose(normalizedMessage, { context: logContext });
//   }

//   setContext(context: string) {
//     super.setContext(context);
//   }

//   /**
//    * Enhanced service error logging with better formatting
//    * Now properly handles object logging
//    */
//   logServiceError(
//     method: string,
//     error: unknown,
//     additionalContext: Record<string, any> = {},
//   ) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     const stack = error instanceof Error ? error.stack : undefined;

//     this.winstonLogger.error(`Error in ${method}: ${errorMessage}`, {
//       context: this.context,
//       method,
//       error: {
//         message: errorMessage,
//         stack,
//         name: error instanceof Error ? error.name : 'Unknown',
//         ...(error instanceof Error && 'cause' in error
//           ? { cause: error.cause }
//           : {}),
//       },
//       ...additionalContext,
//     });
//   }

//   /**
//    * Utility method for logging objects directly (like console.log)
//    * Usage: logger.logObject({ user: {...}, data: [...] })
//    */
//   logObject(
//     obj: any,
//     level: 'info' | 'debug' | 'warn' | 'error' = 'info',
//     context?: string,
//   ) {
//     const logContext = context || this.context;
//     this.winstonLogger[level](obj, { context: logContext });
//   }
// }

import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { inspect } from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  private readonly winstonLogger: winston.Logger;

  constructor(context?: string) {
    super(context || '');

    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({
                level,
                message,
                timestamp,
                context,
                trace,
                stack,
                ...meta
              }) => {
                // Format timestamp
                // Format timestamp
                const time = timestamp
                  ? new Date(timestamp as string).toLocaleTimeString('en-US', {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : '';

                // Format the main message - handle objects properly
                let formattedMessage = message;
                if (typeof message === 'object' && message !== null) {
                  formattedMessage =
                    '\n' +
                    inspect(message, {
                      depth: null,
                      colors: true,
                      maxArrayLength: null,
                      breakLength: 80,
                      compact: false,
                    });
                }

                // Build log line
                let log = `${time} ${level}`;
                if (context) log += ` [${context}]`;
                log += ` ${formattedMessage}`;

                // Remove known fields from meta to avoid duplication
                const { error, errorObject, method, ...restMeta } = meta;

                // Show method if present
                if (method) {
                  log += `\n  ↳ Method: ${method}`;
                }

                // Show error object if present (full error details)
                if (errorObject) {
                  log +=
                    '\n  ↳ Error Object:\n' +
                    inspect(errorObject, {
                      depth: null,
                      colors: true,
                      maxArrayLength: null,
                      breakLength: 80,
                      compact: false,
                    });
                }

                // Show additional metadata if present
                if (Object.keys(restMeta).length > 0) {
                  log +=
                    '\n  ↳ Context:\n' +
                    inspect(restMeta, {
                      depth: null,
                      colors: true,
                      maxArrayLength: null,
                      breakLength: 80,
                      compact: false,
                    });
                }

                // Show stack trace if present
                const stackTrace = trace || stack;
                if (stackTrace) {
                  log += '\n  ↳ Stack Trace:\n' + stackTrace;
                }

                return log;
              },
            ),
          ),
          level: 'silly',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.printf((info) => {
              // Deep clone to avoid mutations
              const logEntry: any = {
                timestamp: info.timestamp,
                level: info.level,
                context: info.context,
                method: info.method,
              };

              // Handle message - convert objects to readable format
              if (typeof info.message === 'object' && info.message !== null) {
                logEntry.message = JSON.parse(JSON.stringify(info.message));
              } else {
                logEntry.message = info.message;
              }

              // Add error object if present
              if (info.errorObject) {
                logEntry.errorObject = JSON.parse(
                  JSON.stringify(info.errorObject),
                );
              }

              // Add stack trace if present
              if (info.trace || info.stack) {
                logEntry.stack = info.trace || info.stack;
              }

              // Add any remaining metadata
              const {
                timestamp,
                level,
                message,
                context,
                trace,
                stack,
                errorObject,
                method,
                ...rest
              } = info;
              if (Object.keys(rest).length > 0) {
                logEntry.metadata = rest;
              }

              return JSON.stringify(logEntry);
            }),
          ),
        }),
      ],
    });
  }

  log(message: any, context?: string) {
    const logContext = context || this.context;
    this.winstonLogger.info(message, { context: logContext });
  }

  error(message: any, trace?: string, context?: string) {
    const logContext = context || this.context;
    this.winstonLogger.error(message, {
      trace,
      context: logContext,
    });
  }

  warn(message: any, context?: string) {
    const logContext = context || this.context;
    this.winstonLogger.warn(message, { context: logContext });
  }

  debug(message: any, context?: string) {
    const logContext = context || this.context;
    this.winstonLogger.debug(message, { context: logContext });
  }

  verbose(message: any, context?: string) {
    const logContext = context || this.context;
    this.winstonLogger.verbose(message, { context: logContext });
  }

  setContext(context: string) {
    super.setContext(context);
  }

  /**
   * Enhanced service error logging with complete error object display
   */
  logServiceError(
    method: string,
    error: unknown,
    additionalContext: Record<string, any> = {},
  ) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    this.winstonLogger.error(`Error in ${method}: ${errorMessage}`, {
      context: this.context,
      method,
      stack,
      errorObject: error, // Complete error object for inspection
      ...additionalContext,
    });
  }

  /**
   * Log objects beautifully (like console.log)
   */
  logObject(
    obj: any,
    label?: string,
    level: 'info' | 'debug' | 'warn' | 'error' = 'info',
  ) {
    const message = label ? `${label}:` : 'Object:';
    this.winstonLogger[level](message, {
      context: this.context,
      data: obj,
    });
  }

  /**
   * Log with separator for better readability
   */
  logSection(title: string, level: 'info' | 'debug' | 'warn' = 'info') {
    const separator = '─'.repeat(50);
    this.winstonLogger[level](`\n${separator}\n${title}\n${separator}`, {
      context: this.context,
    });
  }
}
