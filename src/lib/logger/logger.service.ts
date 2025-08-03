import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  private readonly winstonLogger: winston.Logger;

  constructor(context?: string) {
    // Call the parent (ConsoleLogger) constructor to inherit default NestJS console logging behavior.
    // This allows NestJS to automatically set the context (e.g., 'AppService')
    super(context || '');

    this.winstonLogger = winston.createLogger({
      level: 'info', // Default minimum level for logs to be processed by Winston
      format: winston.format.combine(
        winston.format.timestamp(), // Adds a timestamp to each log entry
        winston.format.json(), // Formats the log output as JSON for machine readability
      ),
      transports: [
        // 1. Console Transport: For human-readable output in your terminal during development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // Adds colors to log levels (e.g., INFO in green)
            winston.format.simple(), // Simple format (e.g., "INFO: My message")
          ),
          level: 'silly', // IMPORTANT: Shows all log levels (even 'debug', 'silly') on the console for dev
        }),
        // 2. File Transport (using winston-daily-rotate-file): For structured JSON logs written to files
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // Log file path, e.g., 'logs/application-2025-06-11.log'
          datePattern: 'YYYY-MM-DD', // Rotates logs daily
          zippedArchive: true, // Compresses old log files (.gz)
          maxSize: '20m', // Maximum size of each log file before rotation
          maxFiles: '14d', // Retain logs for 14 days, then delete older ones
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), // Crucially, use JSON format for file logs (for Promtail/Loki)
          ),
        }),
      ],
    });
  }

  // Override NestJS LoggerService methods to delegate to Winston
  // These methods will be called by NestJS when you use its Logger (e.g., new Logger(MyService.name))
  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string) {
    console.error('🔥 ERROR MESSAGE:', message);
    console.error('🔥 ERROR TRACE:', trace);
    console.error('🔥 ERROR CONTEXT:', context);

    this.winstonLogger.error(message, {
      trace,
      context: context || this.context,
    });
  }

  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context: context || this.context });
  }

  debug(message: any, context?: string) {
    this.winstonLogger.debug(message, { context: context || this.context });
  }

  verbose(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context: context || this.context });
  }

  // You can also override setContext if you need custom logic there, but it's optional
  setContext(context: string) {
    super.setContext(context);
  }

  logServiceError(
    method: string,
    error: unknown,
    context: Record<string, any> = {},
  ) {
    const message = `[${method}] ${error instanceof Error ? error.message : String(error)}`;
    const trace = error instanceof Error ? error.stack : undefined;

    this.error(message, trace, JSON.stringify(context));
  }
}
