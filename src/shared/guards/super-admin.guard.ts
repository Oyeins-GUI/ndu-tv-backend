import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomLogger } from '../../lib/logger/logger.service';
import { Request } from 'express';
import { RESPONSE_MESSAGES } from '../responses/response-messages';
import { ForbiddenException } from '../exceptions';
import { IAdminRepository } from '../../modules/admin/repositories/interfaces/admin-repository.interface';
import { Role } from '../enums';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {
    this.logger.setContext(SuperAdminGuard.name);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();

      if (!req.user)
        throw new UnauthorizedException(
          RESPONSE_MESSAGES.Auth.Failure.EmptyOrInvalidToken,
        );

      const user = await this.adminRepository.findById(req.user.id, {
        relations: ['role'],
      });

      if (!user || user.role.role != Role.SUPER_ADMIN)
        throw new ForbiddenException({
          reason: `You are not permited to perform this action`,
        });

      return true;
    } catch (error) {
      this.logger.error(`an error occured ${error.message}`);
      throw error;
    }
  }
}
