import { Admin } from '../../../../db/models/admins.model';
import { SCOPE } from '../../../../shared/enums';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IAdminRepository
  extends IBaseRepository<
    Admin,
    CreateAdminInput,
    UpdateAdminInput,
    AdminRelations
  > {
  /**
   * Will be used for mainly login
   * @param identifier finds a verified and active adming by identifier (matric number or email)
   * @returns {Admin |null}
   */
  findActiveVerifiedByIdentifier(identifier: string): Promise<Admin | null>;
}

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
  scope: SCOPE;
  must_set_password: boolean;
  is_admin_enabled: boolean;
  last_login_at?: Date;
};

export type UpdateAdminInput = AtLeastOne<CreateAdminInput>;
