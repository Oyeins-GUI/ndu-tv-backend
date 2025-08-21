import { InjectModel } from '@nestjs/sequelize';
import {
  CreateSugPositionInput,
  ISugPositionRepository,
  UpdateSugPositionInput,
} from './interfaces/position-repository.interface';
import { SugPosition } from '../../../db/models/sug-positions.model';
import { IncludeOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/base.repository';

export class SugPositionRepository
  extends BaseRepository<
    SugPosition,
    CreateSugPositionInput,
    UpdateSugPositionInput
  >
  implements ISugPositionRepository
{
  constructor(
    @InjectModel(SugPosition)
    private readonly sugPositionModel: typeof SugPosition,
  ) {
    super(sugPositionModel);
  }

  protected computeRelations(relations: ''[]): IncludeOptions[] {
    return [];
  }
}
