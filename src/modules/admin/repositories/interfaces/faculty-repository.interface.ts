import { Faculty } from '../../../../db/models/faculties.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';

export interface IFacultyRepository
  extends IBaseRepository<
    Faculty,
    CreateFacultyInput,
    UpdateFacultyInput,
    FacultyRelations
  > {}

export type FacultyRelations = 'departments' | 'all';

export type CreateFacultyInput = {
  faculty: string;
};

export type UpdateFacultyInput = CreateFacultyInput;
