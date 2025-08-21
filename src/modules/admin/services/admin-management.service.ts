import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import { AdminDto } from '../dtos/admin.dto';
import { ISugExecutiveRepository } from '../repositories/interfaces/sug-executive-repository.interface';
import { NotFoundException } from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { IRoleRepository } from '../repositories/interfaces/role-repository.interface';
import { IEmailService } from '../../../lib/email/email.interface';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANTS } from '../../../auth/constants';
import { env } from '../../../config';
import {
  TEMPLATE_NAMES,
  TEMPLATE_SUBJECTS,
} from '../../../lib/email/templates';
import { IRedisCacheService } from '../../../lib/redis/redis.interface';
import { getTokenKey } from '../../../auth/auth.utils';
import { generateRandomToken } from '../../../lib/utils';
import {
  AddAdminInput,
  IAdminManagementService,
} from './interfaces/admin-management.interface';

export class AdminManagementService implements IAdminManagementService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

    @Inject('ISugExecutiveRepository')
    private readonly sugExecutiveRepository: ISugExecutiveRepository,

    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,

    @Inject('IEmailService')
    private readonly emailService: IEmailService,

    @Inject('IRedisCacheService')
    private readonly redisCacheService: IRedisCacheService,

    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(AdminManagementService.name);
  }

  public async addAdmin(data: AddAdminInput): Promise<AdminDto> {
    try {
      const [executive, role] = await Promise.all([
        this.sugExecutiveRepository.findById(data.executive_id, {
          relations: ['department', 'faculty'],
        }),
        this.roleRepository.findById(data.role_id),
      ]);

      if (!executive) {
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
          details: {
            executive_id: data.executive_id,
          },
        });
      }

      if (!role) {
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Role.Failure.NotFound,
          details: {
            executive_id: role,
          },
        });
      }

      const admin = await this.adminRepository.create({
        ...executive,
        must_set_password: true,
        executive_id: executive.id,
        role_id: role.id,
      });

      const payload = {
        id: admin.id,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: JWT_CONSTANTS.accessSecret,
        expiresIn: JWT_CONSTANTS.accessExpiry,
      });

      const randomToken = generateRandomToken();

      const tokenKey = getTokenKey('activate-account', randomToken);

      const ttl = 60 * 60 * 24 * 7; //7 days for token expiry

      await this.redisCacheService.setString(tokenKey, token, ttl);

      await this.emailService.sendMail({
        template: TEMPLATE_NAMES.activateAccount,
        to: admin.email,
        subject: TEMPLATE_SUBJECTS.activateAccount,
        context: {
          name: admin.name,
          role: role.role,
          department: executive.department,
          faculty: executive.faculty,
          action_url: `${env.FRONTEND_URL}/verify/?token=${randomToken}`,
          year: new Date().getFullYear(),
        },
      });

      return new AdminDto(admin);
    } catch (error) {
      this.logger.logServiceError(this.addAdmin.name, error, { data });
      throw error;
    }
  }
}
