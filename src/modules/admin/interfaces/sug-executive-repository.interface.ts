import { SugExecutive } from '../../../db/models/sug-executives.model';
import { SCOPE } from '../../../shared/enums';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface ISugExecutiveRepository {
  /**
   * Creates a new SugExecutive
   * @param data - SugExecutive data to create
   * @returns {SugExecutive} - returns the created SugExecutive instance
   */
  create(data: CreateSugExecutiveInput): Promise<SugExecutive>;

  /**
   * Updates a SugExecutive
   * @param data - SugExecutive data to update
   * @returns {SugExecutive} - returns the update SugExecutive instance
   */
  updateByModel(
    model: SugExecutive,
    data: UpdateSugExecutiveInput,
  ): Promise<SugExecutive>;

  /**
   * Finds a SugExecutive by primary key
   * @param id - SugExecutive primary key to find by
   * @param options - Additional options to find by
   * @returns {SugExecutive|null}- the SugExecutive that matches the primary key or null
   */

  findByPk(
    id: string,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive | null>;

  /**
   * Finds a SugExecutive by the specified filters
   * @param filters - filters to find SugExecutive by
   * @param options - Additional options to find by
   * @returns {SugExecutive} - retuns the SugExecutive instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<SugExecutive>,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find SugExecutive by
   * @param options - Additional options to find by
   * @returns - An array of SugExecutives matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<SugExecutive>,
    options?: SugExecutiveFindOptions,
  ): Promise<SugExecutive[]>;

  /**
   * Deletes a SugExecutive
   * @param model - SugExecutive instance to delete
   * @returns {void}- returns void
   */
  delete(model: SugExecutive): Promise<void>;
}

export type CreateSugExecutiveInput = {
  name: string;
  matric_number: string;
  position_id: string;
  session_id: string;
  faculty_id: string;
  department_id: string;
  scope: SCOPE;
};

export type UpdateSugExecutiveInput = AtLeastOne<CreateSugExecutiveInput>;

export type SugExecutiveRelations =
  | 'department'
  | 'faculty'
  | 'position'
  | 'session'
  | 'all';

export type SugExecutiveFindOptions = {
  include_fields?: Array<keyof SugExecutive>;
  include_all?: boolean;
  relations?: SugExecutiveRelations[];
};
