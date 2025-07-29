import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';
import { LoggerModule } from './lib/logger/logger.module';
import { DatabaseModule } from './db/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DEFAULT_RATE_LIMIT_REQUESTS, DEFAULT_RATE_LIMIT_TTL } from './config';
import { RESPONSE_MESSAGES } from './shared/responses/response-messages';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: DEFAULT_RATE_LIMIT_TTL, limit: DEFAULT_RATE_LIMIT_REQUESTS },
      ],
      errorMessage: RESPONSE_MESSAGES.RateLimit,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GlobalExceptionFilter,
    {
      provide: 'APP_FILTER',
      useExisting: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
