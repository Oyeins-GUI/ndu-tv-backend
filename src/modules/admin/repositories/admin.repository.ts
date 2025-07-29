import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../../db/models/admins.model';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import {
  AdminFindOptions,
  AdminRelations,
  CreateAdminInput,
  IAdminRepository,
  UpdateAdminInput,
} from '../interfaces/admin-repository.interface';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FindOptions, IncludeOptions, Op, WhereOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { Role } from '../../../db/models/roles.model';

export class AdminRepository implements IAdminRepository {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {}

  private readonly EXCLUDE_FIELDS: Array<keyof Admin> = [
    'deleted_at',
    'updated_at',
    'password',
    'must_set_password',
  ];

  private computeRelations(relations: AdminRelations[]): IncludeOptions[] {
    const allRelations: AdminRelations[] = [
      'department',
      'faculty',
      'position',
    ];
    const toInclude = relations.includes('all') ? allRelations : relations;

    const include: IncludeOptions[] = [];

    include.push({
      model: Role,
      as: 'role',
    });

    if (toInclude.includes('department')) {
      include.push({
        model: Department,
        as: 'department',
      });
    }

    if (toInclude.includes('faculty')) {
      include.push({
        model: Faculty,
        as: 'faculty',
      });
    }

    if (toInclude.push('position')) {
      include.push({
        model: SugPosition,
        as: 'position',
      });
    }
    return include;
  }

  public async create(data: CreateAdminInput): Promise<Admin> {
    return this.adminModel.create(data);
  }

  public async updateByModel(
    model: Admin,
    data: UpdateAdminInput,
  ): Promise<Admin> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: AdminFindOptions,
  ): Promise<Admin | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Admin> = {
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.adminModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<Admin>,
    options?: AdminFindOptions,
  ): Promise<Admin | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Admin> = {
      where: {
        ...filters,
      } as WhereOptions<Admin>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.adminModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<Admin>,
    options?: AdminFindOptions,
  ): Promise<Admin[]> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Admin> = {
      where: {
        ...filters,
      } as WhereOptions<Admin>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.adminModel.findAll(query);
  }

  public async findActiveVerifiedByIdentifier(
    identifier: string,
  ): Promise<Admin | null> {
    return this.findBy(
      {
        [Op.or]: [
          {
            email: identifier,
            is_active: true,
            is_verified: true,
            must_set_password: false,
          },
          {
            matric_number: identifier,
            is_active: true,
            is_verified: true,
            must_set_password: false,
          },
        ],
      },
      {
        include_fields: ['password'],
        relations: ['all'],
      },
    );
  }

  public async delete(model: Admin): Promise<void> {
    return model.destroy();
  }
}
