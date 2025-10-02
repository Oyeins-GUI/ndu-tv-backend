import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CustomLogger } from '../../lib/logger/logger.service';
import { Reflector } from '@nestjs/core';

import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';
import { ITokenValidationService } from '../interfaces/token-validation.inteface';
import { IS_PUBLIC_KEY } from '../../shared/decorators/public.decorator';
import { UnauthorizedException } from '../../shared/exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('ITokenValidationService')
    private readonly tokenValidationService: ITokenValidationService,
    private logger: CustomLogger,
    private reflector: Reflector,
  ) {
    this.logger.setContext(AuthGuard.name);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      console.log(req);

      const result = await this.tokenValidationService.validateAccessToken(req);

      if (!result) {
        throw new UnauthorizedException({
          reason: RESPONSE_MESSAGES.Auth.Failure.EmptyOrInvalidToken,
        });
      }

      return true;
    } catch (error) {
      this.logger.error(`an error occured ${error.message}`);
      throw error;
    }
  }
}
