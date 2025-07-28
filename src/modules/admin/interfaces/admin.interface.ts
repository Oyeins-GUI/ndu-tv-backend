import { AdminDto } from '../dtos/admin.dto';
import { CreateAdminInput } from './admin-repository.interface';

export interface IAdminService {
  /**
   * Adds a new Admin (Executive)
   * @param data- Data to add
   * @returns {AdminDto} - The newly added admin
   */
  addAdmin(data: CreateAdminInput): Promise<AdminDto>;

  /**
   * Adds a new Admin (Executive)
   * @param data- Data to add
   * @returns {AdminDto} - The newly added admin
   */
  addExecutive(data: CreateAdminInput): Promise<AdminDto>;
}

export type AddAdminInput = {
  sug_executive_id: string;
  email: string;
  role_id: string;
};
