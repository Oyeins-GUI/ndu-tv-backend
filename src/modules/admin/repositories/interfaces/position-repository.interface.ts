import { NansPosition } from '../../../../db/models/nans-positions.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface INansPositionRepository
  extends IBaseRepository<
    NansPosition,
    CreateNansPositionInput,
    UpdateNansPositionInput
  > {}

export type CreateNansPositionInput = {
  position: string;
  title: string;
  description: string;
};

export type UpdateNansPositionInput = AtLeastOne<CreateNansPositionInput>;
