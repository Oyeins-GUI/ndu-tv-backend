import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions, FindOptions, WhereOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import {
  CreateDepartmentInput,
  DepartmentFindOptions,
  DepartmentRelations,
  IDepartmentRepository,
  UpdateDepartmentInput,
} from '../interfaces/department-repository.interface';
import { Faculty } from '../../../db/models/faculties.model';

export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof Department> = [
    'deleted_at',
    'updated_at',
  ];

  private computeRelations(relations: DepartmentRelations[]): IncludeOptions[] {
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

  public async create(data: CreateDepartmentInput): Promise<Department> {
    return this.departmentModel.create(data);
  }

  public async updateByModel(
    model: Department,
    data: UpdateDepartmentInput,
  ): Promise<Department> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: DepartmentFindOptions,
  ): Promise<Department | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Department> = {
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.departmentModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<Department>,
    options?: DepartmentFindOptions,
  ): Promise<Department | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Department> = {
      where: {
        ...filters,
      } as WhereOptions<Department>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.departmentModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<Department>,
    options?: DepartmentFindOptions,
  ): Promise<Department[]> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Department> = {
      where: {
        ...filters,
      } as WhereOptions<Department>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.departmentModel.findAll(query);
  }

  public async delete(model: Department): Promise<void> {
    return model.destroy();
  }
}
