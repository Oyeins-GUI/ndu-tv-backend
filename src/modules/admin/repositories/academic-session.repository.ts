import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { AcademicSession } from '../../../db/models/academic-sessions.model';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import {
  AcademicSessionFindOptions,
  CreateAcademicSessionInput,
  IAcademicSessionRepository,
  UpdateAcademicSessionInput,
} from '../interfaces/academic-session-repository.interface';

export class AcademicSessionRepository implements IAcademicSessionRepository {
  constructor(
    @InjectModel(AcademicSession)
    private readonly academicSessionModel: typeof AcademicSession,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof AcademicSession> = [
    'deleted_at',
    'updated_at',
  ];

  public async create(
    data: CreateAcademicSessionInput,
  ): Promise<AcademicSession> {
    return this.academicSessionModel.create(data);
  }

  public async updateByModel(
    model: AcademicSession,
    data: UpdateAcademicSessionInput,
  ): Promise<AcademicSession> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: AcademicSessionFindOptions,
  ): Promise<AcademicSession | null> {
    const query: FindOptions<AcademicSession> = {
      attributes: {
        exclude: this.EXCLUDE_FIELDS,
      },
    };
    return this.academicSessionModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<AcademicSession>,
    options?: AcademicSessionFindOptions,
  ): Promise<AcademicSession | null> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<AcademicSession> = {
      where: {
        ...filters,
      } as WhereOptions<AcademicSession>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.academicSessionModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<AcademicSession>,
    options?: AcademicSessionFindOptions,
  ): Promise<AcademicSession[]> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<AcademicSession> = {
      where: {
        ...filters,
      } as WhereOptions<AcademicSession>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.academicSessionModel.findAll(query);
  }

  public async delete(model: AcademicSession): Promise<void> {
    return model.destroy();
  }
}
