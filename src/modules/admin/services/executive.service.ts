import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import {
  ISugExecutiveRepository,
  UpdateSugExecutiveInput,
} from '../repositories/interfaces/sug-executive-repository.interface';
import {
  BadRequestException,
  NotFoundException,
} from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { IAcademicSessionRepository } from '../repositories/interfaces/academic-session-repository.interface';
import {
  ISugPositionRepository,
  UpdateSugPositionInput,
} from '../repositories/interfaces/position-repository.interface';
import { SugExecutiveDto, FacultyDto, SugPostionDto } from '../dtos/common.dto';
import { IFacultyRepository } from '../repositories/interfaces/faculty-repository.interface';
import { IDepartmentRepository } from '../repositories/interfaces/department-repository.interface';
import { IExecutiveService } from './interfaces/executive.interface';
import {
  CreateSugExecutiveRequestBody,
  UpdateSugExecutiveRequestBody,
} from '../dtos/admin.request.dto';
import { SCOPE } from '../../../shared/enums';
import { CreateSugPositionRequestBody } from '../dtos/common.request.dto';
import { IAdminRepository } from '../repositories/interfaces/admin-repository.interface';
import { SugExecutive } from '../../../db/models/sug-executives.model';
import { PaginationInput } from '../../../shared/types/repositories.types';
import { or } from '../../../shared/helpers/repository.helper';

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

    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,

    @Inject('ISugPositionRepository')
    private readonly sugPositionRepository: ISugPositionRepository,
  ) {
    this.logger.setContext(ExecutiveService.name);
  }

  public async addExecutive(
    data: CreateSugExecutiveRequestBody,
  ): Promise<SugExecutiveDto> {
    try {
      const [department, session, faculty, position, doesExecutiveExist] =
        await Promise.all([
          this.departmentRepository.findById(data.department_id, {
            relations: ['faculty'],
          }),
          this.academicSessionRepository.findById(data.session_id),
          this.facultyRepository.findById(data.faculty_id),
          this.sugPositionRepository.findById(data.position_id),
          this.sugExecutiveRepository.findBy(
            or([
              { email: data.email },
              { matric_number: data.matric_number },
              { phone_number: data.phone_number },
            ]),
          ),
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

      if (department.faculty.faculty !== faculty.faculty) {
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.DeparmentNotInFaculty,
        });
      }

      if (doesExecutiveExist) {
        if (doesExecutiveExist.phone_number === data.phone_number) {
          throw new BadRequestException({
            reason: 'Phone number already in use',
          });
        }
        if (doesExecutiveExist.email === data.email) {
          throw new BadRequestException({
            reason: 'Email already in use',
          });
        }
        if (doesExecutiveExist.matric_number === data.matric_number) {
          throw new BadRequestException({
            reason: 'Matric number already in use',
          });
        }
      }

      let isExecutiveExisting: SugExecutive | null = null;

      if (data.scope == SCOPE.CENTRAL)
        isExecutiveExisting = await this.sugExecutiveRepository.findBy({
          scope: data.scope,
          session_id: data.session_id,
          position_id: data.position_id,
        });

      if (data.scope == SCOPE.FACULTY)
        isExecutiveExisting = await this.sugExecutiveRepository.findBy({
          scope: data.scope,
          session_id: data.session_id,
          position_id: data.position_id,
          faculty_id: data.faculty_id,
        });

      if (data.scope == SCOPE.DEPARTMENT)
        isExecutiveExisting = await this.sugExecutiveRepository.findBy({
          scope: data.scope,
          session_id: data.session_id,
          position_id: data.position_id,
          department_id: data.department_id,
        });

      if (isExecutiveExisting)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.PostionHeld,
        });

      const executive = await this.sugExecutiveRepository.create(data);

      return new SugExecutiveDto(executive);
    } catch (error) {
      this.logger.logServiceError(this.addExecutive.name, error, { data });
      throw error;
    }
  }

  public async getAllExecutives(
    pagination: PaginationInput,
    session_id?: string,
  ): Promise<SugExecutiveDto[]> {
    try {
      if (session_id) {
        const exectutives = await this.sugExecutiveRepository.findManyBy(
          {
            session_id,
          },
          { page: pagination.page, limit: pagination.limit },
        );
        return SugExecutiveDto.fromEntities(exectutives);
      }

      const session = await this.academicSessionRepository.findBy({
        is_current_session: true,
      });

      if (!session)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.AcademicSession.Failure.NotFound,
        });

      const exectutives = await this.sugExecutiveRepository.findManyBy(
        {
          session_id: session?.id,
        },
        {
          page: pagination.page,
          limit: pagination.limit,
        },
      );
      return SugExecutiveDto.fromEntities(exectutives);
    } catch (error) {
      this.logger.logServiceError(this.getAllExecutives.name, error);
      throw error;
    }
  }

  public async getExecutives({
    scope,
    faculty_id,
    department_id,
    session_id,
  }: {
    scope: SCOPE;
    faculty_id?: string;
    department_id?: string;
    session_id?: string;
  }): Promise<SugExecutiveDto[]> {
    try {
      let sessionId: string;

      if (session_id) {
        sessionId = session_id;
      } else {
        const currentSession = await this.academicSessionRepository.findBy({
          is_current_session: true,
        });

        if (!currentSession)
          throw new BadRequestException({
            reason: RESPONSE_MESSAGES.AcademicSession.Failure.NotFound,
          });

        sessionId = currentSession?.id;
      }

      let sugExecutives: SugExecutiveDto[] = [];

      switch (scope) {
        case SCOPE.CENTRAL:
          const centralExecutives =
            await this.sugExecutiveRepository.findManyBy(
              {
                scope: SCOPE.CENTRAL,
                session_id: sessionId,
              },
              {
                relations: ['all'],
              },
            );
          sugExecutives = SugExecutiveDto.fromEntities(centralExecutives);

        case SCOPE.FACULTY:
          if (!faculty_id)
            throw new BadRequestException({
              reason:
                RESPONSE_MESSAGES.SugExecutive.Failure.FacultyIdNotProvided,
            });
          const faculty = await this.facultyRepository.findById(faculty_id, {});
          if (!faculty)
            throw new NotFoundException({
              reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
            });
          const facultyExecutives =
            await this.sugExecutiveRepository.findManyBy(
              {
                scope: SCOPE.FACULTY,
                faculty_id,
                session_id: sessionId,
              },
              {
                relations: ['all'],
              },
            );
          sugExecutives = SugExecutiveDto.fromEntities(facultyExecutives);

        case SCOPE.DEPARTMENT:
          if (!department_id)
            throw new BadRequestException({
              reason:
                RESPONSE_MESSAGES.SugExecutive.Failure.FacultyIdNotProvided,
            });
          const department =
            await this.facultyRepository.findById(department_id);
          if (!department)
            throw new NotFoundException({
              reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
            });
          const departmentExecutives =
            await this.sugExecutiveRepository.findManyBy(
              {
                scope: SCOPE.FACULTY,
                department_id,
                session_id: sessionId,
              },
              {
                relations: ['all'],
              },
            );
          sugExecutives = SugExecutiveDto.fromEntities(departmentExecutives);
      }
      return sugExecutives;
    } catch (error) {
      this.logger.logServiceError(this.getExecutives.name, error);
      throw error;
    }
  }

  public async getExecutive(executive_id: string): Promise<SugExecutiveDto> {
    try {
      const executive = await this.sugExecutiveRepository.findById(
        executive_id,
        {
          relations: ['all'],
        },
      );

      if (!executive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
        });

      return new SugExecutiveDto(executive);
    } catch (error) {
      this.logger.logServiceError(this.getExecutive.name, error);
      throw error;
    }
  }

  public async getSugPostions(): Promise<SugPostionDto[]> {
    try {
      const sugPositions = await this.sugPositionRepository.findManyBy({});

      return SugPostionDto.fromEntities(sugPositions);
    } catch (error) {
      this.logger.logServiceError(this.getSugPostions.name, error);
      throw error;
    }
  }

  public async addSugPostion(
    data: CreateSugPositionRequestBody,
  ): Promise<SugPostionDto> {
    try {
      const sugPosition = await this.sugPositionRepository.create(data);
      return new SugPostionDto(sugPosition);
    } catch (error) {
      this.logger.logServiceError(this.addSugPostion.name, error);
      throw error;
    }
  }

  public async updateSugPostion(
    sug_position_id: string,
    data: UpdateSugExecutiveRequestBody,
  ): Promise<SugPostionDto> {
    try {
      const sugPosition =
        await this.sugPositionRepository.findById(sug_position_id);

      if (!sugPosition)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.SugPosition.Failure.NotFound,
        });

      const updatedSugPostion = await this.sugPositionRepository.updateByModel(
        sugPosition,
        data as unknown as UpdateSugPositionInput,
      );
      return new SugPostionDto(updatedSugPostion);
    } catch (error) {
      this.logger.logServiceError(this.updateSugPostion.name, error);
      throw error;
    }
  }

  public async deleteExecutive(executive_id: string): Promise<void> {
    try {
      const sugExecutive =
        await this.sugExecutiveRepository.findById(executive_id);

      if (!sugExecutive)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
        });

      const isAdmin = await this.adminRepository.findBy({ executive_id });

      if (isAdmin)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.SugExecutive.Failure.IsAnAdmin,
        });

      await this.sugExecutiveRepository.delete(sugExecutive);
    } catch (error) {
      this.logger.logServiceError(this.deleteExecutive.name, error);
      throw error;
    }
  }

  public async updateExecutive(
    executive_id: string,
    data: UpdateSugExecutiveRequestBody,
  ): Promise<SugExecutiveDto> {
    try {
      const executive =
        await this.sugExecutiveRepository.findById(executive_id);

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
