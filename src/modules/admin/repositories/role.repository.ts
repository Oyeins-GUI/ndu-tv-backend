import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Role } from '../../../db/models/roles.model';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import {
  CreateRoleInput,
  IRoleRepository,
  RoleFindOptions,
  UpdateRoleInput,
} from '../interfaces/role-repository.interface';

export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof Role> = [
    'deleted_at',
    'updated_at',
  ];

  public async create(data: CreateRoleInput): Promise<Role> {
    return this.roleModel.create(data);
  }

  public async updateByModel(
    model: Role,
    data: UpdateRoleInput,
  ): Promise<Role> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: RoleFindOptions,
  ): Promise<Role | null> {
    const query: FindOptions<Role> = {
      attributes: {
        exclude: this.EXCLUDE_FIELDS,
      },
    };
    return this.roleModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<Role>,
    options?: RoleFindOptions,
  ): Promise<Role | null> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Role> = {
      where: {
        ...filters,
      } as WhereOptions<Role>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.roleModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<Role>,
    options?: RoleFindOptions,
  ): Promise<Role[]> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<Role> = {
      where: {
        ...filters,
      } as WhereOptions<Role>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.roleModel.findAll(query);
  }

  public async delete(model: Role): Promise<void> {
    return model.destroy();
  }
}
