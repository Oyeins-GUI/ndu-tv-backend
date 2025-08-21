import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions, FindOptions, WhereOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';

import {
  IFacultyRepository,
  FacultyRelations,
  CreateFacultyInput,
  UpdateFacultyInput,
} from './interfaces/faculty-repository.interface';
import { BaseRepository } from '../../../shared/repositories/base.repository';

export class FacultyRepository
  extends BaseRepository<
    Faculty,
    CreateFacultyInput,
    UpdateFacultyInput,
    FacultyRelations
  >
  implements IFacultyRepository
{
  constructor(
    @InjectModel(Faculty) private readonly facultyModel: typeof Faculty,
  ) {
    super(facultyModel);
  }

  protected computeRelations(relations: FacultyRelations[]): IncludeOptions[] {
    const allRelations: FacultyRelations[] = ['departments'];
    const toInclude = relations.includes('all') ? allRelations : relations;
    const include: IncludeOptions[] = [];
    if (toInclude.includes('departments')) {
      include.push({
        model: Department,
        as: 'departments',
      });
    }
    return include;
  }
}
