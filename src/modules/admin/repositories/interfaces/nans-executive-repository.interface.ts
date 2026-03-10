import { NansExecutive } from '../../../../db/models/nans-executives.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface INansExecutiveRepository
  extends IBaseRepository<
    NansExecutive,
    CreateNansExecutiveInput,
    UpdateNansExecutiveInput,
    NansExecutiveRelations
  > {}

export type CreateNansExecutiveInput = {
  name: string;

  year: string;
  position_id: string;
  image_url: string;
};

export type UpdateNansExecutiveInput = AtLeastOne<CreateNansExecutiveInput>;

export type NansExecutiveRelations = 'position' | 'all';
