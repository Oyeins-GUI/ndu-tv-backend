import { AcademicSession } from '../../../../db/models/academic-sessions.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IAcademicSessionRepository
  extends IBaseRepository<
    AcademicSession,
    CreateAcademicSessionInput,
    UpdateAcademicSessionInput
  > {}

export type CreateAcademicSessionInput = {
  session: string;
  is_current_session: boolean;
};

export type UpdateAcademicSessionInput = AtLeastOne<CreateAcademicSessionInput>;
