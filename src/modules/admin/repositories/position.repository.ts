import { InjectModel } from '@nestjs/sequelize';
import { NansPosition } from '../../../db/models/nans-positions.model';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import {
  CreateNansPositionInput,
  UpdateNansPositionInput,
  INansPositionRepository,
} from './interfaces/position-repository.interface';
import { IncludeOptions } from 'sequelize';

export class NansPositionRepository
  extends BaseRepository<
    NansPosition,
    CreateNansPositionInput,
    UpdateNansPositionInput
  >
  implements INansPositionRepository
{
  constructor(
    @InjectModel(NansPosition)
    private readonly NansPositionModel: typeof NansPosition,
  ) {
    super(NansPositionModel);
  }

  protected computeRelations(relations: ''[]): IncludeOptions[] {
    return [];
  }
}
