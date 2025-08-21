import { Role } from '../../../../db/models/roles.model';
import { Role as RoleEnum } from '../../../../shared/enums';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IRoleRepository
  extends IBaseRepository<Role, CreateRoleInput, UpdateRoleInput> {}

export type CreateRoleInput = {
  role: RoleEnum;
  description: string;
};

export type UpdateRoleInput = AtLeastOne<CreateRoleInput>;
