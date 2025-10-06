import { Inject, Injectable } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import { AdminDto } from '../dtos/admin.dto';
import { ISugExecutiveRepository } from '../repositories/interfaces/sug-executive-repository.interface';
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
import {
  AddAdminInput,
  IAdminManagementService,
} from './interfaces/admin-management.interface';
import { Role as RoleEnum, SCOPE } from '../../../shared/enums';
import { RoleDto } from '../dtos/common.dto';
import { IAcademicSessionRepository } from '../repositories/interfaces/academic-session-repository.interface';
import { mapRoles } from '../../../shared/helpers/service.helper';
import { UpdateAdminRequestBody } from '../dtos/admin.request.dto';

@Injectable()
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

    @Inject('IAcademicSessionRepository')
    private readonly academicSessionRepository: IAcademicSessionRepository,

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
        (admin) =>
          admin.scope !== SCOPE.SUPER &&
          admin.role.role !== RoleEnum.SUPER_ADMIN,
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

  public async addAdmin(data: AddAdminInput): Promise<AdminDto> {
    try {
      const doesAdminExist = await this.adminRepository.findBy({
        executive_id: data.executive_id,
      });

      if (doesAdminExist) {
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.Admin.Failiure.AlreadyExists,
        });
      }

      const [executive, role] = await Promise.all([
        this.sugExecutiveRepository.findById(data.executive_id, {
          relations: ['department', 'faculty', 'session'],
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

      if (!executive.session.is_current_session) {
        throw new BadRequestException({
          reason:
            RESPONSE_MESSAGES.SugExecutive.Failure
              .MustBeCurrentSessionExecutive,
        });
      }

      const allowedRoles = {
        [SCOPE.CENTRAL]: RoleEnum.CENTRAL_EXEC,
        [SCOPE.FACULTY]: RoleEnum.FACULTY_EXEC,
        [SCOPE.DEPARTMENT]: RoleEnum.DEPARTMENT_EXEC,
      };

      if (role.role !== allowedRoles[executive.scope])
        throw new BadRequestException({
          reason: 'Role must match its corresponding scope',
        });

      const admin = await this.adminRepository.create({
        ...executive.toJSON(),
        must_set_password: true,
        executive_id: executive.id,
        role_id: role.id,
        is_admin_enabled: true,
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
          role: mapRoles(role.role),
          department: executive.department.department,
          faculty: executive.faculty.faculty,
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

      if (data.role_id) {
        const allowedRoles = {
          [SCOPE.CENTRAL]: RoleEnum.CENTRAL_EXEC,
          [SCOPE.FACULTY]: RoleEnum.FACULTY_EXEC,
          [SCOPE.DEPARTMENT]: RoleEnum.DEPARTMENT_EXEC,
        };

        const role = await this.roleRepository.findById(data.role_id);

        if (!role) {
          throw new NotFoundException({
            reason: RESPONSE_MESSAGES.Role.Failure.NotFound,
            details: {
              executive_id: role,
            },
          });
        }

        if (role.role !== allowedRoles[admin.scope])
          throw new BadRequestException({
            reason: 'Role must match its corresponding scope',
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
