import { Faculty } from '../../../db/models/faculties.model';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';

export interface IFacultyRepository {
  /**
   * Creates a new Faculty
   * @param data - Faculty data to create
   * @returns {Faculty} - returns the created Faculty instance
   */
  create(data: CreateFacultyInput): Promise<Faculty>;

  /**
   * Updates a Faculty
   * @param data - Faculty data to update
   * @returns {Faculty} - returns the update Faculty instance
   */
  updateByModel(model: Faculty, data: UpdateFacultyInput): Promise<Faculty>;

  /**
   * Finds a Faculty by primary key
   * @param id - Faculty primary key to find by
   * @param options - Additional options to find by
   * @returns {Faculty|null}- the Faculty that matches the primary key or null
   */

  findByPk(id: string, options?: FacultyFindOptions): Promise<Faculty | null>;

  /**
   * Finds a Faculty by the specified filters
   * @param filters - filters to find Faculty by
   * @param options - Additional options to find by
   * @returns {Faculty} - retuns the Faculty instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<Faculty>,
    options?: FacultyFindOptions,
  ): Promise<Faculty | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find Faculty by
   * @param options - Additional options to find by
   * @returns - An array of Facultys matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<Faculty>,
    options?: FacultyFindOptions,
  ): Promise<Faculty[]>;

  /**
   * Deletes a Faculty
   * @param model - Faculty instance to delete
   * @returns {void}- returns void
   */
  delete(model: Faculty): Promise<void>;
}

export type FacultyFindOptions = {
  include_fields?: Array<keyof Faculty>;
  include_all?: boolean;
  relations?: FacultyRelations[];
};

export type FacultyRelations = 'departments' | 'all';

export type CreateFacultyInput = {
  faculty: string;
};

export type UpdateFacultyInput = CreateFacultyInput;
