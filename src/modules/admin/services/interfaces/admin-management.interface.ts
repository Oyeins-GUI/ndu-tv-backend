import { AdminDto } from '../../dtos/admin.dto';
import { UpdateAdminRequestBody } from '../../dtos/admin.request.dto';
import { RoleDto } from '../../dtos/common.dto';

export interface IAdminManagementService {
  /**
   * Get all current admins
   */
  getAdmins(): Promise<AdminDto[]>;

  /**
   * Adds a new Admin (Executive)
   * @param data- Data to add
   * @returns {AdminDto} - The newly added admin
   */
  addAdmin(data: AddAdminInput): Promise<AdminDto>;

  /**
   * Removes an admin
   * @param admin_id: ID of the Admin to remove
   */
  removeAdmin(admin_id: string): Promise<void>;

  /**
   * Gets Roles
   */
  getRoles(): Promise<RoleDto[]>;

  updateAdmin(
    admin_id: string,
    data: UpdateAdminRequestBody,
  ): Promise<AdminDto>;
}

export type AddAdminInput = {
  executive_id: string;
  role_id: string;
};
