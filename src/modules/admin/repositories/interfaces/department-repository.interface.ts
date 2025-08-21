import { Department } from '../../../../db/models/departments.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IDepartmentRepository
  extends IBaseRepository<
    Department,
    CreateDepartmentInput,
    UpdateDepartmentInput,
    DepartmentRelations
  > {}

export type DepartmentRelations = 'faculty' | 'all';

export type CreateDepartmentInput = {
  faculty_id: string;
  department: string;
  options?: string[] | null;
};

export type UpdateDepartmentInput = AtLeastOne<CreateDepartmentInput>;
