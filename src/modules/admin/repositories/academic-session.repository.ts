import { InjectModel } from '@nestjs/sequelize';
import { AcademicSession } from '../../../db/models/academic-sessions.model';
import {
  CreateAcademicSessionInput,
  IAcademicSessionRepository,
  UpdateAcademicSessionInput,
} from './interfaces/academic-session-repository.interface';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { IncludeOptions } from 'sequelize';

export class AcademicSessionRepository
  extends BaseRepository<
    AcademicSession,
    CreateAcademicSessionInput,
    UpdateAcademicSessionInput
  >
  implements IAcademicSessionRepository
{
  constructor(
    @InjectModel(AcademicSession)
    private readonly academicSessionModel: typeof AcademicSession,
  ) {
    super(academicSessionModel);
  }

  protected computeRelations(relations: ''[]): IncludeOptions[] {
    return [];
  }
}
