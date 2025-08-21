import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions } from 'sequelize';
import { Role } from '../../../db/models/roles.model';

import {
  CreateRoleInput,
  IRoleRepository,
  UpdateRoleInput,
} from './interfaces/role-repository.interface';
import { BaseRepository } from '../../../shared/repositories/base.repository';

export class RoleRepository
  extends BaseRepository<Role, CreateRoleInput, UpdateRoleInput>
  implements IRoleRepository
{
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) {
    super(roleModel);
  }

  protected computeRelations(relations: ''[]): IncludeOptions[] {
    return [];
  }
}
