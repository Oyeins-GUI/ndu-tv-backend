import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../../db/models/admins.model';
import {
  AdminRelations,
  CreateAdminInput,
  IAdminRepository,
  UpdateAdminInput,
} from './interfaces/admin-repository.interface';
import { Role } from '../../../db/models/roles.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { IncludeOptions } from 'sequelize';

export class AdminRepository
  extends BaseRepository<
    Admin,
    CreateAdminInput,
    UpdateAdminInput,
    AdminRelations
  >
  implements IAdminRepository
{
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {
    super(adminModel);
  }

  protected EXCLUDE_FIELDS: Array<keyof Admin> = [
    'deleted_at',
    'updated_at',
    'password',
    'must_set_password',
  ];

  protected computeRelations(relations: AdminRelations[]): IncludeOptions[] {
    const allRelations: AdminRelations[] = ['role'];
    const toInclude = relations.includes('all') ? allRelations : relations;
    const include: IncludeOptions[] = [];
    include.push({
      model: Role,
      as: 'role',
    });

    return include;
  }
}
