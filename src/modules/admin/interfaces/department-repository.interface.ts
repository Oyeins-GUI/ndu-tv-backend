import { Department } from '../../../db/models/departments.model';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface IDepartmentRepository {
  /**
   * Creates a new Department
   * @param data - Department data to create
   * @returns {Department} - returns the created Department instance
   */
  create(data: CreateDepartmentInput): Promise<Department>;

  /**
   * Updates a Department
   * @param data - Department data to update
   * @returns {Department} - returns the update Department instance
   */
  updateByModel(
    model: Department,
    data: UpdateDepartmentInput,
  ): Promise<Department>;

  /**
   * Finds a Department by primary key
   * @param id - Department primary key to find by
   * @param options - Additional options to find by
   * @returns {Department|null}- the Department that matches the primary key or null
   */

  findByPk(
    id: string,
    options?: DepartmentFindOptions,
  ): Promise<Department | null>;

  /**
   * Finds a Department by the specified filters
   * @param filters - filters to find Department by
   * @param options - Additional options to find by
   * @returns {Department} - retuns the Department instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<Department>,
    options?: DepartmentFindOptions,
  ): Promise<Department | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find Department by
   * @param options - Additional options to find by
   * @returns - An array of Departments matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<Department>,
    options?: DepartmentFindOptions,
  ): Promise<Department[]>;

  /**
   * Deletes a Department
   * @param model - Department instance to delete
   * @returns {void}- returns void
   */
  delete(model: Department): Promise<void>;
}

export type DepartmentFindOptions = {
  include_fields?: Array<keyof Department>;
  include_all?: boolean;
  relations?: DepartmentRelations[];
};

export type DepartmentRelations = 'faculty' | 'all';

export type CreateDepartmentInput = {
  faculty_id: string;
  department: string;
  options?: string[] | null;
};

export type UpdateDepartmentInput = AtLeastOne<CreateDepartmentInput>;
