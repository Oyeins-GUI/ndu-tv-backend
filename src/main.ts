import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'node:path';
import * as fs from 'fs';
import { API_PREFIX, env } from './config';
import setUpSwagger from './config/swagger.config';
import { CustomLogger } from './lib/logger/logger.service';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationException } from './shared/exceptions';
import { setUpRateLimiting } from './config/rate-limit.config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     bufferLogs: true,
//     logger: new CustomLogger('NDU-TV API'),
//   });

//   const logsDirectory = path.join(__dirname, '..', 'logs');

//   if (!fs.existsSync(logsDirectory)) {
//     fs.mkdirSync(logsDirectory);
//     console.log(`Created logs directory: ${logsDirectory}`);
//   }

//   app.enableCors({
//     origin: '*',
//     methods: '*',
//     allowedHeaders: '*',
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       exceptionFactory: (errors: ValidationError[]) => {
//         const formatted = errors.flatMap((error) => {
//           return Object.values(error.constraints || {}).map((message) => ({
//             field: error.property,
//             message,
//           }));
//         });

//         return new ValidationException(formatted);
//       },
//     }),
//   );

//   app.use(helmet());

//   app.use(cookieParser());

//   app.setGlobalPrefix(API_PREFIX);

//   setUpSwagger(app);

//   setUpRateLimiting(app);

//   await app.listen(env.PORT ?? 4000);

//   console.log(`Application is running on: ${await app.getUrl()}`);
// }

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: new CustomLogger('NDU-TV API'),
    });

    const logsDirectory = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory);
      console.log(`Created logs directory: ${logsDirectory}`);
    }

    app.enableCors({ origin: '*', methods: '*', allowedHeaders: '*' });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const formatted = errors.flatMap((error) =>
            Object.values(error.constraints || {}).map((message) => ({
              field: error.property,
              message,
            })),
          );
          return new ValidationException(formatted);
        },
      }),
    );

    app.use(helmet());
    app.use(cookieParser());
    app.setGlobalPrefix(API_PREFIX);
    setUpSwagger(app);
    setUpRateLimiting(app);

    await app.listen(env.PORT ?? 4000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {
    console.error('❌ Application failed to start:', err);
    process.exit(1);
  }
}
bootstrap();
