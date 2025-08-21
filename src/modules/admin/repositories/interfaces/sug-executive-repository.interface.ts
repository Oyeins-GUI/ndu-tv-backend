import { SugExecutive } from '../../../../db/models/sug-executives.model';
import { SCOPE } from '../../../../shared/enums';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../../shared/types/repositories.types';

export interface ISugExecutiveRepository
  extends IBaseRepository<
    SugExecutive,
    CreateSugExecutiveInput,
    UpdateSugExecutiveInput,
    SugExecutiveRelations
  > {}

export type CreateSugExecutiveInput = {
  name: string;
  email: string;
  matric_number: string;
  position_id: string;
  session_id: string;
  faculty_id: string;
  department_id: string;
  phone_number: string;
  scope: SCOPE;
  image_url: string;
};

export type UpdateSugExecutiveInput = AtLeastOne<CreateSugExecutiveInput>;

export type SugExecutiveRelations =
  | 'department'
  | 'faculty'
  | 'position'
  | 'session'
  | 'all';
