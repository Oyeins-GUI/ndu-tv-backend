import { AdminDto } from '../dtos/admin.dto';
import { SugExecutiveDto } from '../dtos/common.dto';
import {
  CreateSugExecutiveInput,
  UpdateSugExecutiveInput,
} from './sug-executive-repository.interface';

export interface IAdminService {
  /**
   * Adds a new Admin (Executive)
   * @param data- Data to add
   * @returns {AdminDto} - The newly added admin
   */
  addAdmin(data: AddAdminInput): Promise<AdminDto>;

  /**
   * Adds a new Executive
   * @param data- Data to add
   * @returns {SugExecutiveDto} - The newly added executive
   */
  addExecutive(data: CreateSugExecutiveInput): Promise<SugExecutiveDto>;

  /**
   * Updates an SUG Executive data
   * @param executive_id - ID of the execuvitve data
   * @param data - Data to update
   * @returns {SugExecutiveDto}- The newly updated sug executive
   */
  updateExecutive(
    executive_id: string,
    data: UpdateSugExecutiveInput,
  ): Promise<SugExecutiveDto>;
}

export type AddAdminInput = {
  executive_id: string;
  role_id: string;
};
