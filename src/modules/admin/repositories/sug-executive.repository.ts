import { InjectModel } from '@nestjs/sequelize';
import { SugExecutive } from '../../../db/models/sug-executives.model';
import {
  CreateSugExecutiveInput,
  ISugExecutiveRepository,
  SugExecutiveRelations,
  UpdateSugExecutiveInput,
} from './interfaces/sug-executive-repository.interface';
import { IncludeOptions } from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { AcademicSession } from '../../../db/models/academic-sessions.model';
import { Admin } from '../../../db/models/admins.model';
import { Sequelize } from 'sequelize-typescript';
import { BaseRepository } from '../../../shared/repositories/base.repository';

export class SugExecutiveRepository
  extends BaseRepository<
    SugExecutive,
    CreateSugExecutiveInput,
    UpdateSugExecutiveInput,
    SugExecutiveRelations
  >
  implements ISugExecutiveRepository
{
  constructor(
    @InjectModel(SugExecutive)
    private readonly sugExecutiveModel: typeof SugExecutive,

    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,

    private readonly seqeulize: Sequelize,
  ) {
    super(sugExecutiveModel);
  }

  protected computeRelations(
    relations: SugExecutiveRelations[],
  ): IncludeOptions[] {
    const allRelations: SugExecutiveRelations[] = [
      'department',
      'faculty',
      'position',
    ];
    const toInclude = relations.includes('all') ? allRelations : relations;

    const include: IncludeOptions[] = [];

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

    if (toInclude.push('session')) {
      include.push({
        model: AcademicSession,
        as: 'session',
      });
    }
    return include;
  }

  public async updateByModel(
    model: SugExecutive,
    data: UpdateSugExecutiveInput,
  ): Promise<SugExecutive> {
    return this.seqeulize.transaction(async (t) => {
      const executive = await model.update(data, { transaction: t });

      const admin = await this.adminModel.findOne({
        where: {
          executive_id: executive.id,
        },
        transaction: t,
      });

      if (admin) {
        admin.update({ ...executive }, { transaction: t });
      }
      return executive;
    });
  }
}
