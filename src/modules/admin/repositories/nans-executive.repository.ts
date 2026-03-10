import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions } from 'sequelize';
import { Admin } from '../../../db/models/admins.model';
import { NansExecutive } from '../../../db/models/nans-executives.model';
import { NansPosition } from '../../../db/models/nans-positions.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import {
  CreateNansExecutiveInput,
  UpdateNansExecutiveInput,
  NansExecutiveRelations,
  INansExecutiveRepository,
} from './interfaces/nans-executive-repository.interface';
import { Sequelize } from 'sequelize-typescript';

export class NansExecutiveRepository
  extends BaseRepository<
    NansExecutive,
    CreateNansExecutiveInput,
    UpdateNansExecutiveInput,
    NansExecutiveRelations
  >
  implements INansExecutiveRepository
{
  constructor(
    @InjectModel(NansExecutive)
    private readonly NansExecutiveModel: typeof NansExecutive,

    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,

    private readonly sequelize: Sequelize,
  ) {
    super(NansExecutiveModel);
  }

  protected computeRelations(
    relations: NansExecutiveRelations[],
  ): IncludeOptions[] {
    const allRelations: NansExecutiveRelations[] = ['position'];
    const toInclude = relations.includes('all') ? allRelations : relations;

    const include: IncludeOptions[] = [];

    if (toInclude.push('position')) {
      include.push({
        model: NansPosition,
        as: 'position',
      });
    }

    return include;
  }
}
