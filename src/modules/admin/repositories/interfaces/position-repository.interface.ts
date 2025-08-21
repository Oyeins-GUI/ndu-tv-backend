import { SugPosition } from '../../../../db/models/sug-positions.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../../shared/types/repositories.types';

export interface ISugPositionRepository
  extends IBaseRepository<
    SugPosition,
    CreateSugPositionInput,
    UpdateSugPositionInput
  > {}

export type CreateSugPositionInput = {
  position: string;
  title: string;
  description: string;
};

export type UpdateSugPositionInput = AtLeastOne<CreateSugPositionInput>;
