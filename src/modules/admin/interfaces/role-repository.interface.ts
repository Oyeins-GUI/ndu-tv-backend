import { Role } from '../../../db/models/roles.model';
import { Role as RoleEnum } from '../../../shared/enums';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface IRoleRepository {
  /**
   * Creates a new Role
   * @param data - Role data to create
   * @returns {Role} - returns the created Role instance
   */
  create(data: CreateRoleInput): Promise<Role>;

  /**
   * Updates a Role
   * @param data - Role data to update
   * @returns {Role} - returns the update Role instance
   */
  updateByModel(model: Role, data: UpdateRoleInput): Promise<Role>;

  /**
   * Finds a Role by primary key
   * @param id - Role primary key to find by
   * @param options - Additional options to find by
   * @returns {Role|null}- the Role that matches the primary key or null
   */

  findByPk(id: string, options?: RoleFindOptions): Promise<Role | null>;

  /**
   * Finds a Role by the specified filters
   * @param filters - filters to find Role by
   * @param options - Additional options to find by
   * @returns {Role} - retuns the Role instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<Role>,
    options?: RoleFindOptions,
  ): Promise<Role | null>;

  /**
   * Find all Faculties matching the filters
   * @param filters - filters to find Role by
   * @param options - Additional options to find by
   * @returns - An array of Roles matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<Role>,
    options?: RoleFindOptions,
  ): Promise<Role[]>;

  /**
   * Deletes a Role
   * @param model - Role instance to delete
   * @returns {void}- returns void
   */
  delete(model: Role): Promise<void>;
}

export type RoleFindOptions = {
  include_fields?: Array<keyof Role>;
  include_all?: boolean;
};

export type CreateRoleInput = {
  role: RoleEnum;
  description: string;
};

export type UpdateRoleInput = AtLeastOne<CreateRoleInput>;
