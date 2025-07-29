import { Admin } from '../../../db/models/admins.model';
import { SCOPE } from '../../../shared/enums';
import {
  AtLeastOne,
  FiltersOrOperators,
} from '../../../shared/types/repositories.types';

export interface IAdminRepository {
  /**
   * Creates a new admin
   * @param data - Admin data to create
   * @returns {Admin} - returns the created admin instance
   */
  create(data: CreateAdminInput): Promise<Admin>;

  /**
   * Updates an admin
   * @param data - Admin data to update
   * @returns {Admin} - returns the update admin instance
   */
  updateByModel(model: Admin, data: UpdateAdminInput): Promise<Admin>;

  /**
   * Finds an Admin by primary key
   * @param id - admin primary key to find by
   * @param options - Additional options to find by
   * @returns {Admin|null}- the admin that matches the primary key or null
   */

  findByPk(id: string, options?: AdminFindOptions): Promise<Admin | null>;

  /**
   * Finds an Admin by the specified filters
   * @param filters - filters to find admin by
   * @param options - Additional options to find by
   * @returns {Admin} - retuns the admin instance matching the filters
   */

  findBy(
    filters: FiltersOrOperators<Admin>,
    options?: AdminFindOptions,
  ): Promise<Admin | null>;

  /**
   * Find all admins matching the filters
   * @param filters - filters to find admin by
   * @param options - Additional options to find by
   * @returns - An array of admins matching the filters or null
   */

  findManyBy(
    filters: FiltersOrOperators<Admin>,
    options?: AdminFindOptions,
  ): Promise<Admin[]>;

  /**
   * Will be used for mainly login
   * @param identifier finds a verified and active adming by identifier (matric number or email)
   * @returns {Admin |null}
   */
  findActiveVerifiedByIdentifier(identifier: string): Promise<Admin | null>;

  /**
   * Deletes an admin
   * @param model - Admin instance to delete
   * @returns {void}- returns void
   */
  delete(model: Admin): Promise<void>;
}

export type AdminFindOptions = {
  include_fields?: Array<keyof Admin>;
  include_all?: boolean;
  relations?: AdminRelations[];
};

export type AdminRelations =
  | 'department'
  | 'faculty'
  | 'position'
  | 'role'
  | 'all';

export type CreateAdminInput = {
  name: string;
  email: string;
  executive_id: string;
  matric_number: string;
  password?: string;
  role_id: string;
  position_id: string;
  faculty_id: string;
  department_id: string;
  is_active: boolean;
  scope: SCOPE;
  must_set_password: boolean;
};

export type UpdateAdminInput = AtLeastOne<CreateAdminInput>;
