import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ITokenValidationService } from '../interfaces/token-validation.inteface';
import { CustomLogger } from '../../lib/logger/logger.service';
import { RESPONSE_MESSAGES } from '../../shared/responses/response-messages';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject('ITokenValidationService')
    private readonly tokenValidationService: ITokenValidationService,
    private logger: CustomLogger,
  ) {
    this.logger.setContext(RefreshTokenGuard.name);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const result = await this.tokenValidationService.validateRefreshToken(req);

      if (!result) {
        throw new UnauthorizedException(RESPONSE_MESSAGES.Auth.Failure.EmptyOrInvalidToken);
      }

      return true;
    } catch (error) {
      this.logger.error(`an error occured ${error.message}`);
      throw error;
    }
  }
}
