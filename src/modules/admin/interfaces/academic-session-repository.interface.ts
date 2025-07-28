import { AcademicSession } from '../../../db/models/academic-sessions.model';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface IAcademicSessionRepository {
  /**
   * Creates a new Academic Academic Session
   * @param data - Academic Academic Session data to create
   * @returns {AcademicSession} - returns the created Academic Session instance
   */
  create(data: CreateAcademicSessionInput): Promise<AcademicSession>;

  /**
   * Updates a Academic Session
   * @param data - Academic Session data to update
   * @returns {AcademicSession} - returns the update Academic Session instance
   */
  updateByModel(
    model: AcademicSession,
    data: UpdateAcademicSessionInput,
  ): Promise<AcademicSession>;

  /**
   * Finds a Academic Session by primary key
   * @param id - Academic Session primary key to find by
   * @param options - Additional options to find by
   * @returns {AcademicSession|null}- the Academic Session that matches the primary key or null
   */

  findByPk(id: string): Promise<AcademicSession | null>;

  /**
   * Finds a Academic Session by the specified filters
   * @param filters - filters to find Academic Session by
   * @param options - Additional options to find by
   * @returns {AcademicSession} - retuns the Academic Session instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<AcademicSession>,
  ): Promise<AcademicSession | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find Academic Session by
   * @param options - Additional options to find by
   * @returns - An array of Academic Sessions matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<AcademicSession>,
  ): Promise<AcademicSession[]>;

  /**
   * Deletes a Academic Session
   * @param model - Academic Session instance to delete
   * @returns {void}- returns void
   */
  delete(model: AcademicSession): Promise<void>;
}

export type AcademicSessionFindOptions = {
  include_fields?: Array<keyof AcademicSession>;
  include_all?: boolean;
};

export type CreateAcademicSessionInput = {
  session: string;
  is_current_session: boolean;
};

export type UpdateAcademicSessionInput = AtLeastOne<CreateAcademicSessionInput>;
