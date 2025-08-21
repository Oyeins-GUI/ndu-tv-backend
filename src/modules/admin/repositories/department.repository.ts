import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import {
  CreateDepartmentInput,
  DepartmentRelations,
  IDepartmentRepository,
  UpdateDepartmentInput,
} from './interfaces/department-repository.interface';
import { Faculty } from '../../../db/models/faculties.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';

export class DepartmentRepository
  extends BaseRepository<
    Department,
    CreateDepartmentInput,
    UpdateDepartmentInput,
    DepartmentRelations
  >
  implements IDepartmentRepository
{
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {
    super(departmentModel);
  }

  protected computeRelations(
    relations: DepartmentRelations[],
  ): IncludeOptions[] {
    const allRelations: DepartmentRelations[] = ['faculty'];
    const toInclude = relations.includes('all') ? allRelations : relations;
    const include: IncludeOptions[] = [];
    if (toInclude.includes('faculty')) {
      include.push({
        model: Faculty,
        as: 'faculty',
      });
    }
    return include;
  }
}
