import { AdminDto } from '../../dtos/admin.dto';

export interface IAdminManagementService {
  /**
   * Adds a new Admin (Executive)
   * @param data- Data to add
   * @returns {AdminDto} - The newly added admin
   */
  addAdmin(data: AddAdminInput): Promise<AdminDto>;
}

export type AddAdminInput = {
  executive_id: string;
  role_id: string;
};
