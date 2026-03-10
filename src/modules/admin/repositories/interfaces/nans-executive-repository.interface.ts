import { NansExecutive } from '../../../../db/models/nans-executives.model';
import { ExecType } from '../../../../shared/enums/execs.enum';
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
  exec_type: ExecType;
};

export type UpdateNansExecutiveInput = AtLeastOne<CreateNansExecutiveInput>;

export type NansExecutiveRelations = 'position' | 'all';
