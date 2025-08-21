import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import {
  ISugExecutiveRepository,
  UpdateSugExecutiveInput,
} from '../repositories/interfaces/sug-executive-repository.interface';
import { NotFoundException } from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { IAcademicSessionRepository } from '../repositories/interfaces/academic-session-repository.interface';
import { ISugPositionRepository } from '../repositories/interfaces/position-repository.interface';
import { SugExecutiveDto, FacultyDto } from '../dtos/common.dto';
import { IFacultyRepository } from '../repositories/interfaces/faculty-repository.interface';
import { IDepartmentRepository } from '../repositories/interfaces/department-repository.interface';
import { IExecutiveService } from './interfaces/executive.interface';
import {
  CreateSugExecutiveRequestBody,
  UpdateSugExecutiveRequestBody,
} from '../dtos/admin.request.dto';

export class ExecutiveService implements IExecutiveService {
  constructor(
    private readonly logger: CustomLogger,

    @Inject('IDepartmentRepository')
    private readonly departmentRepository: IDepartmentRepository,

    @Inject('IFacultyRepository')
    private readonly facultyRepository: IFacultyRepository,

    @Inject('ISugExecutiveRepository')
    private readonly sugExecutiveRepository: ISugExecutiveRepository,

    @Inject('IAcademicSessionRepository')
    private readonly academicSessionRepository: IAcademicSessionRepository,

    @Inject('ISugPositionRepository')
    private readonly sugPositionRepository: ISugPositionRepository,
  ) {
    this.logger.setContext(ExecutiveService.name);
  }

  public async addExecutive(
    data: CreateSugExecutiveRequestBody,
  ): Promise<SugExecutiveDto> {
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

  public async updateExecutive(
    executive_id: string,
    data: UpdateSugExecutiveRequestBody,
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
        data as UpdateSugExecutiveInput,
      );

      return new SugExecutiveDto(updatedExecutive);
    } catch (error) {
      this.logger.logServiceError(this.updateExecutive.name, error, { data });
      throw error;
    }
  }
}
