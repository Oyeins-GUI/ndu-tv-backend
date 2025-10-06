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
import { AdminModule } from './modules/admin/admin.module';
import { AuthModlue } from './auth/auth.module';
import { AuthGuard } from './auth/gaurds/auth.guard';
import { TokenValidationService } from './auth/services/token-validation.service';
import { RedisModule } from './lib/redis/redis.module';
import { RefreshTokenGuard } from './auth/gaurds/refresh.guard';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    RedisModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: DEFAULT_RATE_LIMIT_TTL, limit: DEFAULT_RATE_LIMIT_REQUESTS },
      ],
      errorMessage: RESPONSE_MESSAGES.RateLimit,
    }),
    AuthModlue,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenValidationService,
    { provide: 'ITokenValidationService', useExisting: TokenValidationService },
    GlobalExceptionFilter,
    {
      provide: 'APP_FILTER',
      useExisting: GlobalExceptionFilter,
    },
    AuthGuard,
    RefreshTokenGuard,
    {
      provide: 'APP_GUARD',
      useExisting: AuthGuard,
    },
  ],
})
export class AppModule {}
