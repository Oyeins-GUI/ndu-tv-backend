import { InjectModel } from '@nestjs/sequelize';
import { SugExecutive } from '../../../db/models/sug-executives.model';
import {
  CreateSugExecutiveInput,
  ISugExecutiveRepository,
  SugExecutiveFindOptions,
  SugExecutiveRelations,
  UpdateSugExecutiveInput,
} from '../interfaces/sug-executive-repository.interface';
import {
  FindOptions,
  IncludeOptions,
  InstanceUpdateOptions,
  WhereOptions,
} from 'sequelize';
import { Department } from '../../../db/models/departments.model';
import { Faculty } from '../../../db/models/faculties.model';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import { AcademicSession } from '../../../db/models/academic-sessions.model';
import { Admin } from '../../../db/models/admins.model';
import { Sequelize } from 'sequelize-typescript';

export class SugExecutiveRepository implements ISugExecutiveRepository {
  constructor(
    @InjectModel(SugExecutive)
    private readonly sugExecutiveModel: typeof SugExecutive,

    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,

    private readonly seqeulize: Sequelize,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof SugExecutive> = [
    'deleted_at',
    'updated_at',
  ];

  private computeRelations(
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

  public async create(data: CreateSugExecutiveInput): Promise<SugExecutive> {
    return this.sugExecutiveModel.create(data);
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

  public async findByPk(
    id: string,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<SugExecutive> = {
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.sugExecutiveModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<SugExecutive>,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive | null> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<SugExecutive> = {
      where: {
        ...filters,
      } as WhereOptions<SugExecutive>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.sugExecutiveModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<SugExecutive>,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive[]> {
    const include = this.computeRelations(options?.relations ?? []);
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<SugExecutive> = {
      where: {
        ...filters,
      } as WhereOptions<SugExecutive>,
      attributes: {
        exclude: excludeFields,
      },
      include,
    };
    return this.sugExecutiveModel.findAll(query);
  }

  public async delete(model: SugExecutive): Promise<void> {
    return model.destroy();
  }
}
