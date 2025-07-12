import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter';
import { LoggerModule } from './lib/logger/logger.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
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
