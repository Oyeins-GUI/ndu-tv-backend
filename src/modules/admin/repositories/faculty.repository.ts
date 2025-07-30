import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions, FindOptions, WhereOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import {
  IFacultyRepository,
  FacultyRelations,
  CreateFacultyInput,
  UpdateFacultyInput,
  FacultyFindOptions,
} from '../interfaces/faculty-repository.interface';

export class FacultyRepository implements IFacultyRepository {
  constructor(
    @InjectModel(Faculty) private readonly facultyModel: typeof Faculty,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof Faculty> = [
    'deleted_at',
    'updated_at',
  ];

  private computeRelations(relations: FacultyRelations[]): IncludeOptions[] {
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

  public async create(data: CreateFacultyInput): Promise<Faculty> {
    return this.facultyModel.create(data);
  }

  public async updateByModel(
    model: Faculty,
    data: UpdateFacultyInput,
  ): Promise<Faculty> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: FacultyFindOptions,
  ): Promise<Faculty | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Faculty> = {
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.facultyModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<Faculty>,
    options?: FacultyFindOptions,
  ): Promise<Faculty | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Faculty> = {
      where: {
        ...filters,
      } as WhereOptions<Faculty>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.facultyModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<Faculty>,
    options?: FacultyFindOptions,
  ): Promise<Faculty[]> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Faculty> = {
      where: {
        ...filters,
      } as WhereOptions<Faculty>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.facultyModel.findAll(query);
  }

  public async delete(model: Faculty): Promise<void> {
    return model.destroy();
  }
}
