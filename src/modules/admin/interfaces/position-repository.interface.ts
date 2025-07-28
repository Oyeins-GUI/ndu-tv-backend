import { SugPosition } from '../../../db/models/sug-positions.model';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface ISugPositionRepository {
  /**
   * Creates a new SugPosition
   * @param data - SugPosition data to create
   * @returns {SugPosition} - returns the created SugPosition instance
   */
  create(data: CreateSugPositionInput): Promise<SugPosition>;

  /**
   * Updates a SugPosition
   * @param data - SugPosition data to update
   * @returns {SugPosition} - returns the update SugPosition instance
   */
  updateByModel(
    model: SugPosition,
    data: UpdateSugPositionInput,
  ): Promise<SugPosition>;

  /**
   * Finds a SugPosition by primary key
   * @param id - SugPosition primary key to find by
   * @param options - Additional options to find by
   * @returns {SugPosition|null}- the SugPosition that matches the primary key or null
   */

  findByPk(
    id: string,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition | null>;

  /**
   * Finds a SugPosition by the specified filters
   * @param filters - filters to find SugPosition by
   * @param options - Additional options to find by
   * @returns {SugPosition} - retuns the SugPosition instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<SugPosition>,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find SugPosition by
   * @param options - Additional options to find by
   * @returns - An array of SugPositions matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<SugPosition>,
    options?: SugPositionFindOptions,
  ): Promise<SugPosition[]>;

  /**
   * Deletes a SugPosition
   * @param model - SugPosition instance to delete
   * @returns {void}- returns void
   */
  delete(model: SugPosition): Promise<void>;
}

export type SugPositionFindOptions = {
  include_fields?: Array<keyof SugPosition>;
  include_all?: boolean;
};

export type CreateSugPositionInput = {
  position: string;
  title: string;
  description: string;
};

export type UpdateSugPositionInput = AtLeastOne<CreateSugPositionInput>;
