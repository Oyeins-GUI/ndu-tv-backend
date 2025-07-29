import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../interfaces/admin-repository.interface';
import { AddAdminInput, IAdminService } from '../interfaces/admin.interface';
import { AdminDto } from '../dtos/admin.dto';
import { IDepartmentRepository } from '../interfaces/department-repository.interface';
import { IFacultyRepository } from '../interfaces/faculty-repository.interface';
import {
  CreateSugExecutiveInput,
  ISugExecutiveRepository,
  UpdateSugExecutiveInput,
} from '../interfaces/sug-executive-repository.interface';
import { NotFoundException } from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { IRoleRepository } from '../interfaces/role-repository.interface';
import { IAcademicSessionRepository } from '../interfaces/academic-session-repository.interface';
import { ISugPositionRepository } from '../interfaces/position-repository.interface';
import { SugExecutiveDto } from '../dtos/common.dto';
import { IEmailService } from '../../../lib/email/email.interface';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANTS } from '../../../auth/constants';
import { env } from '../../../config';

export class AdminService implements IAdminService {
  constructor(
    private readonly logger: CustomLogger,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

    @Inject('IDepartmentRepository')
    private readonly departmentRepository: IDepartmentRepository,

    @Inject('IFacultyRepository')
    private readonly facultyRepository: IFacultyRepository,

    @Inject('ISugExecutiveRepository')
    private readonly sugExecutiveRepository: ISugExecutiveRepository,

    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,

    @Inject('IAcademicSessionRepository')
    private readonly academicSessionRepository: IAcademicSessionRepository,

    @Inject('ISugPositionRepository')
    private readonly sugPositionRepository: ISugPositionRepository,

    @Inject('IEmailService')
    private readonly emailService: IEmailService,

    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(AdminService.name);
  }

  public async addExecutive(data: CreateSugExecutiveInput): Promise<any> {
    try {
      const [department, session, faculty, position] = await Promise.all([
        this.departmentRepository.findByPk(data.department_id),
        this.academicSessionRepository.findByPk(data.session_id),
        this.facultyRepository.findByPk(data.faculty_id),
        this.sugPositionRepository.findByPk(data.position_id),
      ]);

      if (!faculty || !department || !session || !position) {
        throw new NotFoundException({
          reason: !faculty
            ? RESPONSE_MESSAGES.Faculty.Failure.NotFound
            : !department
              ? RESPONSE_MESSAGES.Department.Failure.NotFound
              : !session
                ? RESPONSE_MESSAGES.AcademicSession.Failure.NotFound
                : RESPONSE_MESSAGES.SugPosition.Failure.NotFound,
        });
      }

      const executive = await this.sugExecutiveRepository.create(data);

      return new SugExecutiveDto(executive);
    } catch (error) {
      this.logger.logServiceError(this.addExecutive.name, error, { data });
      throw error;
    }
  }

  public async addAdmin(data: AddAdminInput): Promise<AdminDto> {
    try {
      const [executive, role] = await Promise.all([
        this.sugExecutiveRepository.findByPk(data.executive_id, {
          relations: ['department', 'faculty'],
        }),
        this.roleRepository.findByPk(data.role_id),
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
        is_active: false,
        must_set_password: true,
        executive_id: executive.id,
        role_id: role.id,
      });

      const payload = {
        id: admin.id,
        email: admin.email,
        matric_number: admin.matric_number,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: JWT_CONSTANTS.accessSecret,
        expiresIn: JWT_CONSTANTS.accessExpiry,
      });

      await this.emailService.sendMail({
        template: 'verify-email',
        to: admin.email,
        subject: 'Activate your NDU-TV Admin account',
        context: {
          name: admin.name,
          role: role.role,
          department: executive.department,
          faculty: executive.faculty,
          action_url: `${env.FRONTEND_URL}/verify/${token}`,
        },
      });

      return new AdminDto(admin);
    } catch (error) {
      this.logger.logServiceError(this.addAdmin.name, error, { data });
      throw error;
    }
  }

  public async updateExecutive(
    executive_id: string,
    data: UpdateSugExecutiveInput,
  ): Promise<SugExecutiveDto> {
    try {
      const executive =
        await this.sugExecutiveRepository.findByPk(executive_id);

      if (!executive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
          details: {
            id: executive_id,
          },
        });
      const updatedExecutive = await this.sugExecutiveRepository.updateByModel(
        executive,
        data,
      );

      return new SugExecutiveDto(updatedExecutive);
    } catch (error) {
      this.logger.logServiceError(this.updateExecutive.name, error, { data });
      throw error;
    }
  }
}
