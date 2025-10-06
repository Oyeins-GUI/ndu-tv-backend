import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ForbiddenException,
  UnauthorizedException,
} from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import { IRoleRepository } from '../repositories/interfaces/role-repository.interface';
import { Role, SCOPE } from '../../../shared/enums';

@Injectable()
export class CentralAdminGuard implements CanActivate {
  constructor(
    @Inject() private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {
    this.logger.setContext(CentralAdminGuard.name);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.user.id)
      throw new UnauthorizedException({
        reason: RESPONSE_MESSAGES.Auth.Failure.NotAuthorized,
      });

    const admin = await this.adminRepository.findById(req.user.id, {
      relations: ['role'],
    });

    if (!admin) {
      throw new UnauthorizedException({
        reason: RESPONSE_MESSAGES.Auth.Failure.NotAuthorized,
      });
    }

    if (
      admin.scope !== SCOPE.CENTRAL &&
      admin.scope !== SCOPE.SUPER &&
      admin.role.role !== Role.CENTRAL_EXEC &&
      admin.role.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException({
        reason: RESPONSE_MESSAGES.Auth.Failure.Forbidden,
      });
    }

    return true;
  }
}
