import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './constants';
import { AdminModule } from '../modules/admin/admin.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EmailService } from '../lib/email/email.service';

import { TokenValidationService } from './services/token-validation.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.accessSecret,
      signOptions: { expiresIn: JWT_CONSTANTS.accessExpiry },
    }),
    AdminModule,
  ],
  providers: [
    AuthService,
    TokenValidationService,
    { provide: 'ITokenValidationService', useExisting: TokenValidationService },
    { provide: 'IAuthService', useExisting: AuthService },
    EmailService,
    { provide: 'IEmailService', useExisting: EmailService },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModlue {}
