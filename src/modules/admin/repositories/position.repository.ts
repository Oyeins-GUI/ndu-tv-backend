import { InjectModel } from '@nestjs/sequelize';
import {
  CreateSugPositionInput,
  ISugPositionRepository,
  SugPositionFindOptions,
  UpdateSugPositionInput,
} from '../interfaces/position-repository.interface';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { FindOptions, WhereOptions } from 'sequelize';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import { getExcludedFields } from '../../../shared/helpers/repository.helper';

export class SugPositionRepository implements ISugPositionRepository {
  constructor(
    @InjectModel(SugPosition)
    private readonly sugPositionModel: typeof SugPosition,
  ) {}

  private readonly EXCLUDE_FIELDS: Array<keyof SugPosition> = [
    'deleted_at',
    'updated_at',
  ];

  public async create(data: CreateSugPositionInput): Promise<SugPosition> {
    return this.sugPositionModel.create(data);
  }

  public async updateByModel(
    model: SugPosition,
    data: UpdateSugPositionInput,
  ): Promise<SugPosition> {
    return model.update(data);
  }

  public async findByPk(
    id: string,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition | null> {
    const query: FindOptions<SugPosition> = {
      attributes: {
        exclude: this.EXCLUDE_FIELDS,
      },
    };
    return this.sugPositionModel.findByPk(id, query);
  }

  public async findBy(
    filters: FiltersOrOperators<SugPosition>,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition | null> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<SugPosition> = {
      where: {
        ...filters,
      } as WhereOptions<SugPosition>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.sugPositionModel.findOne(query);
  }

  public async findManyBy(
    filters: FiltersOrOperators<SugPosition>,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition[]> {
    const excludeFields = getExcludedFields(
      this.EXCLUDE_FIELDS,
      options?.include_fields ?? [],
    );
    const query: FindOptions<SugPosition> = {
      where: {
        ...filters,
      } as WhereOptions<SugPosition>,
      attributes: {
        exclude: excludeFields,
      },
    };
    return this.sugPositionModel.findAll(query);
  }

  public async delete(model: SugPosition): Promise<void> {
    return model.destroy();
  }
}
