import { Inject, Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import { AdminDto } from '../dtos/admin.dto';
import {
  BadRequestException,
  NotFoundException,
} from '../../../shared/exceptions';
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
import { IAdminManagementService } from './interfaces/admin-management.interface';
import { Role as RoleEnum } from '../../../shared/enums';
import { RoleDto } from '../dtos/common.dto';

import {
  CreateAdminRequestBody,
  UpdateAdminRequestBody,
} from '../dtos/admin.request.dto';

@Injectable()
export class AdminManagementService implements IAdminManagementService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

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

  public async getAdmins(): Promise<AdminDto[]> {
    try {
      const admins = await this.adminRepository.findManyBy(
        {},
        { relations: ['all'] },
      );

      const filteredAdmins = admins.filter(
        (admin) => admin.role.role !== RoleEnum.SUPER_ADMIN,
      );

      return AdminDto.fromEntities(filteredAdmins);
    } catch (error) {
      this.logger.logServiceError(this.getAdmins.name, error);
      throw error;
    }
  }

  public async getRoles(): Promise<RoleDto[]> {
    try {
      const roles = await this.roleRepository.findManyBy({});

      const filteredRoles = roles.filter(
        (role) => role.role !== RoleEnum.SUPER_ADMIN,
      );
      return RoleDto.fromEntities(filteredRoles);
    } catch (error) {
      this.logger.logServiceError(this.getRoles.name, error);
      throw error;
    }
  }

  public async addAdmin(data: CreateAdminRequestBody): Promise<AdminDto> {
    try {
      const doesAdminExist = await this.adminRepository.findBy({
        email: data.email,
      });

      if (doesAdminExist) {
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.Admin.Failiure.AlreadyExists,
        });
      }

      const role = await this.roleRepository.findById(data.role_id);

      if (!role) {
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Role.Failure.NotFound,
          details: {
            executive_id: role,
          },
        });
      }

      const admin = await this.adminRepository.create({
        ...data,
        must_set_password: true,
        role_id: role.id,
        is_admin_enabled: true,
      });

      const payload = {
        id: admin.id,
        email: admin.email,
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
          app_name: env.APP_NAME,
          name: admin.name,
          role: role.role,
          action_url: `${env.FRONTEND_URL}/admin/new?token=${randomToken}`,
          year: new Date().getFullYear(),
        },
      });

      return new AdminDto(admin);
    } catch (error) {
      this.logger.logServiceError(this.addAdmin.name, error, { data });
      throw error;
    }
  }

  public async removeAdmin(admin_id: string): Promise<void> {
    try {
      const admin = await this.adminRepository.findById(admin_id);

      if (!admin)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Admin.Failiure.NotFound,
        });

      await this.adminRepository.delete(admin);
    } catch (error) {
      this.logger.logServiceError(this.removeAdmin.name, error);
      throw error;
    }
  }

  public async updateAdmin(
    admin_id: string,
    data: UpdateAdminRequestBody,
  ): Promise<AdminDto> {
    try {
      const admin = await this.adminRepository.findById(admin_id);

      if (!admin)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Admin.Failiure.NotFound,
        });

      const role = await this.roleRepository.findById(data.role_id);

      if (!role) {
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Role.Failure.NotFound,
          details: {
            executive_id: role,
          },
        });
      }
      const updatedAdmin = await this.adminRepository.updateByModel(
        admin,
        data,
      );

      return new AdminDto(updatedAdmin);
    } catch (error) {
      this.logger.logServiceError(this.removeAdmin.name, error);
      throw error;
    }
  }
}
