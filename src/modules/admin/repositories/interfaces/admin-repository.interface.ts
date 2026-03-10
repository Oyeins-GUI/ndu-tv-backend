import { Admin } from '../../../../db/models/admins.model';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IAdminRepository
  extends IBaseRepository<
    Admin,
    CreateAdminInput,
    UpdateAdminInput,
    AdminRelations
  > {}

export type AdminRelations = 'role' | 'all';

export type CreateAdminInput = {
  name: string;
  email: string;
  password?: string;
  role_id: string;
  must_set_password: boolean;
  is_admin_enabled: boolean;
};

export type UpdateAdminInput = AtLeastOne<
  CreateAdminInput & {
    last_login_at?: Date;
    last_password_change?: Date;
  }
>;
