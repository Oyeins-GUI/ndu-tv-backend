import { Inject } from '@nestjs/common';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  AcademicSessionDto,
  DepartmentDto,
  FacultyDto,
} from '../dtos/common.dto';
import {
  CreateAcademicSessionRequestBody,
  CreateDepartmentRequestBody,
  CreateFacultyRequestBody,
  UpdateAcademicSessionRequestBody,
  UpdateDepartmentRequestBody,
} from '../dtos/common.request.dto';
import { IAcademicService } from './interfaces/academic.interface';
import {
  IDepartmentRepository,
  UpdateDepartmentInput,
} from '../repositories/interfaces/department-repository.interface';
import { IFacultyRepository } from '../repositories/interfaces/faculty-repository.interface';
import {
  BadRequestException,
  NotFoundException,
} from '../../../shared/exceptions';
import {
  IAcademicSessionRepository,
  UpdateAcademicSessionInput,
} from '../repositories/interfaces/academic-session-repository.interface';
import { Sequelize } from 'sequelize-typescript';
import { IEventService } from '../../../lib/event/event.interface';
import { ADMIN_EVENT_NAMES } from '../events/event.names';

export class AcademicService implements IAcademicService {
  constructor(
    private readonly logger: CustomLogger,

    @Inject('IDepartmentRepository')
    private readonly departmentRepository: IDepartmentRepository,

    @Inject('IFacultyRepository')
    private readonly facultyRepository: IFacultyRepository,

    @Inject('IAcademicSessionRepository')
    private readonly academicSessionRepository: IAcademicSessionRepository,

    @Inject() private readonly seqeulize: Sequelize,

    @Inject('IEventService') private readonly eventService: IEventService,
  ) {
    this.logger.setContext(AcademicService.name);
  }

  public async addDepartment(
    data: CreateDepartmentRequestBody,
  ): Promise<DepartmentDto> {
    try {
      const faculty = await this.facultyRepository.findById(data.faculty_id);

      if (!faculty)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
          details: {
            faculty_id: data.faculty_id,
          },
        });

      const deparment = await this.departmentRepository.create(data);

      return new DepartmentDto(deparment);
    } catch (error) {
      this.logger.logServiceError(this.addDepartment.name, error, { data });
      throw error;
    }
  }

  public async updateDepartment(
    id: string,
    data: UpdateDepartmentRequestBody,
  ): Promise<DepartmentDto> {
    try {
      const deparment = await this.departmentRepository.findById(id);

      if (!deparment)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Department.Failure.NotFound,
          details: {
            deparment_id: id,
          },
        });
      const updated = await this.departmentRepository.updateByModel(
        deparment,
        data as UpdateDepartmentInput,
      );

      return new DepartmentDto(updated);
    } catch (error) {
      this.logger.logServiceError(this.updateDepartment.name, error, { data });
      throw error;
    }
  }

  public async getDepartment(department_id: string): Promise<DepartmentDto> {
    try {
      const deparment = await this.departmentRepository.findById(department_id);

      if (!deparment)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Department.Failure.NotFound,
          details: {
            department_id,
          },
        });
      return new DepartmentDto(deparment);
    } catch (error) {
      this.logger.logServiceError(this.getDepartment.name, error);
      throw error;
    }
  }

  public async getDepartments(faculty_id?: string): Promise<DepartmentDto[]> {
    try {
      if (faculty_id) {
        const faculty = await this.facultyRepository.findById(faculty_id);
        if (!faculty)
          throw new NotFoundException({
            reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
            details: {
              faculty_id: faculty_id,
            },
          });
        const deparments = await this.departmentRepository.findManyBy({
          faculty_id,
        });
        return DepartmentDto.fromEntities(deparments);
      }

      const deparments = await this.departmentRepository.findManyBy({});
      return DepartmentDto.fromEntities(deparments);
    } catch (error) {
      this.logger.logServiceError(this.getDepartments.name, error);
      throw error;
    }
  }

  public async deleteDepartment(id: string): Promise<void> {
    try {
      const deparment = await this.departmentRepository.findById(id);

      if (!deparment)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Department.Failure.NotFound,
          details: {
            deparment_id: id,
          },
        });

      await this.departmentRepository.delete(deparment);
    } catch (error) {
      this.logger.logServiceError(this.deleteDepartment.name, error, { id });
      throw error;
    }
  }

  public async addFaculty(data: CreateFacultyRequestBody): Promise<FacultyDto> {
    try {
      const faculty = await this.facultyRepository.create(data);

      return new FacultyDto(faculty);
    } catch (error) {
      this.logger.logServiceError(this.addFaculty.name, error, { data });
      throw error;
    }
  }

  public async updateFaculty(
    id: string,
    data: CreateFacultyRequestBody,
  ): Promise<FacultyDto> {
    try {
      const faculty = await this.facultyRepository.findById(id);

      if (!faculty)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
          details: {
            faculty_id: id,
          },
        });

      const updated = await this.facultyRepository.updateByModel(faculty, data);

      return new FacultyDto(updated);
    } catch (error) {
      this.logger.logServiceError(this.updateFaculty.name, error, { data });
      throw error;
    }
  }

  public async getFaculty(id: string): Promise<FacultyDto> {
    try {
      const faculty = await this.facultyRepository.findById(id, {
        relations: ['departments'],
      });

      if (!faculty)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
          details: {
            faculty_id: id,
          },
        });

      return new FacultyDto(faculty);
    } catch (error) {
      this.logger.logServiceError(this.getFaculty.name, error, { id });
      throw error;
    }
  }

  public async getFaculties(): Promise<FacultyDto[]> {
    try {
      const faculties = await this.facultyRepository.findManyBy(
        {},
        {
          relations: ['departments'],
        },
      );

      const filteredFaculities = faculties.filter((f) => f.faculty !== 'Admin');

      return FacultyDto.fromEntities(filteredFaculities);
    } catch (error) {
      this.logger.logServiceError(this.getFaculties.name, error);
      throw error;
    }
  }

  public async getAcademicSessions(): Promise<AcademicSessionDto[]> {
    try {
      const sessions = await this.academicSessionRepository.findManyBy({});
      return AcademicSessionDto.fromEntities(sessions);
    } catch (error) {
      this.logger.logServiceError(this.getAcademicSessions.name, error);
      throw error;
    }
  }

  public async addAcademicSession(
    data: CreateAcademicSessionRequestBody,
  ): Promise<AcademicSessionDto> {
    try {
      if (data.is_current_session && data.is_next_session) {
        throw new BadRequestException({
          reason: 'A session cannot be current and next at same time',
        });
      }
      return this.seqeulize.transaction(async (t) => {
        const [existingSession, existingCurrent, existingNext] =
          await Promise.all([
            this.academicSessionRepository.findBy(
              { session: data.session },
              {
                transaction: t,
              },
            ),
            data.is_current_session
              ? this.academicSessionRepository.findBy(
                  {
                    is_current_session: true,
                  },
                  {
                    transaction: t,
                  },
                )
              : Promise.resolve(null),
            data.is_next_session
              ? this.academicSessionRepository.findBy(
                  { is_next_session: true },
                  {
                    transaction: t,
                  },
                )
              : Promise.resolve(null),
          ]);

        if (existingSession) {
          throw new BadRequestException({
            reason: `Academic session ${data.session} already exists`,
          });
        }

        // if (existingCurrent) {
        //   throw new BadRequestException({
        //     reason: `There is already a current session: ${existingCurrent.session}`,
        //   });
        // }

        // if (existingNext) {
        //   throw new BadRequestException({
        //     reason: `There is already a next session: ${existingNext.session}`,
        //   });
        // }

        if (existingCurrent) {
          await this.academicSessionRepository.updateByModel(
            existingCurrent,
            {
              is_current_session: false,
            },
            { transaction: t },
          );
        }

        if (existingNext) {
          const currentSession = await this.academicSessionRepository.findBy(
            { is_current_session: true },
            { transaction: t },
          );

          const [currentStart, currentEnd] = currentSession!.session
            .split('/')
            .map(Number);
          const [nextStart, nextEnd] = data.session.split('/').map(Number);

          if (nextStart !== currentStart + 1 || nextEnd !== currentEnd + 1) {
            throw new BadRequestException({
              reason: `Next session must immediately follow the current session ${currentSession?.session}`,
            });
          }

          await this.academicSessionRepository.updateByModel(
            existingNext,
            {
              is_next_session: false,
            },
            { transaction: t },
          );
        }

        const created = await this.academicSessionRepository.create(data, {
          transaction: t,
        });

        this.eventService.emit(ADMIN_EVENT_NAMES.SessionUpdated, {});

        return new AcademicSessionDto(created);
      });
    } catch (error) {
      this.logger.logServiceError(this.addAcademicSession.name, error);
      throw error;
    }
  }

  public async updateAcademicSession(
    session_id: string,
    data: UpdateAcademicSessionRequestBody,
  ): Promise<AcademicSessionDto> {
    try {
      if (data.is_current_session && data.is_next_session) {
        throw new BadRequestException({
          reason: 'A session cannot be current and next at same time',
        });
      }

      return this.seqeulize.transaction(async (t) => {
        const session = await this.academicSessionRepository.findById(
          session_id,
          { transaction: t },
        );
        if (!session) {
          throw new NotFoundException({
            reason: `Academic session with id ${session_id} not found`,
          });
        }

        const existingSessionName = await this.academicSessionRepository.findBy(
          {
            session: data.session,
          },
          { transaction: t },
        );

        if (existingSessionName && existingSessionName.id == session_id) {
          throw new BadRequestException({
            reason: 'Acadmic Session already exists',
          });
        }

        if (data.is_current_session) {
          const existingCurrentSession =
            await this.academicSessionRepository.findBy(
              { is_current_session: true },
              { transaction: t },
            );
          if (existingCurrentSession)
            await this.academicSessionRepository.updateByModel(
              existingCurrentSession,
              {
                is_current_session: false,
              },
              { transaction: t },
            );
        }

        if (data.is_next_session) {
          const currentSession = await this.academicSessionRepository.findBy(
            { is_current_session: true },
            { transaction: t },
          );

          const [currentStart, currentEnd] = currentSession!.session
            .split('/')
            .map(Number);

          if (data.session) {
            const [nextStart, nextEnd] = data.session?.split('/').map(Number);

            if (nextStart !== currentStart + 1 || nextEnd !== currentEnd + 1) {
              throw new BadRequestException({
                reason: `Next session must immediately follow the current session ${currentSession?.session}`,
              });
            }
          } else {
            const [nextStart, nextEnd] = session.session
              ?.split('/')
              .map(Number);

            if (nextStart !== currentStart + 1 || nextEnd !== currentEnd + 1) {
              throw new BadRequestException({
                reason: `Next session must immediately follow the current session ${currentSession?.session}`,
              });
            }
          }

          const existingNextSession =
            await this.academicSessionRepository.findBy(
              { is_next_session: true },
              { transaction: t },
            );
          if (existingNextSession)
            await this.academicSessionRepository.updateByModel(
              existingNextSession,
              {
                is_next_session: false,
              },
              { transaction: t },
            );
        }
        const updatedSession =
          await this.academicSessionRepository.updateByModel(
            session,
            data as UpdateAcademicSessionInput,
            {
              transaction: t,
            },
          );

        this.eventService.emit(ADMIN_EVENT_NAMES.SessionUpdated, {});

        return new AcademicSessionDto(updatedSession);
      });
    } catch (error) {
      this.logger.logServiceError(this.updateAcademicSession.name, error);
      throw error;
    }
  }

  public async deleteFaculty(id: string): Promise<void> {
    try {
      const faculty = await this.facultyRepository.findById(id);

      if (!faculty)
        throw new NotFoundException({
          reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
          details: {
            faculty_id: id,
          },
        });

      await this.facultyRepository.delete(faculty);
    } catch (error) {
      this.logger.logServiceError(this.deleteFaculty.name, error, { id });
      throw error;
    }
  }
}
