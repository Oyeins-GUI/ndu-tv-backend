import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../../db/models/admins.model';
import {
  AdminRelations,
  CreateAdminInput,
  IAdminRepository,
  UpdateAdminInput,
} from './interfaces/admin-repository.interface';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { Role } from '../../../db/models/roles.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { IncludeOptions, Op } from 'sequelize';

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

  public async findActiveVerifiedByIdentifier(
    identifier: string,
  ): Promise<Admin | null> {
    return this.findBy(
      {
        [Op.or]: [
          {
            email: identifier,
            must_set_password: false,
          },
          {
            matric_number: identifier,
            must_set_password: false,
          },
        ],
      },
      {
        includeFields: ['password'],
        relations: ['all'],
      },
    );
  }
}
