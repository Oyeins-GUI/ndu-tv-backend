import {
  CreateSugExecutiveRequestBody,
  UpdateSugExecutiveRequestBody,
} from '../../dtos/admin.request.dto';
import { SugExecutiveDto } from '../../dtos/common.dto';

export interface IExecutiveService {
  /**
   * Adds a new Executive
   * @param data- Data to add
   * @returns {SugExecutiveDto} - The newly added executive
   */
  addExecutive(data: CreateSugExecutiveRequestBody): Promise<SugExecutiveDto>;

  // /**
  //  * Adds a new Executive
  //  * @param data- Data to add
  //  * @returns {SugExecutiveDto} - The newly added executive
  //  */
  // addSugPostion(data: CreateSugExecutiveRequestBody): Promise<SugPostionDto>;

  /**
   * Updates an SUG Executive data
   * @param executive_id - ID of the execuvitve data
   * @param data - Data to update
   * @returns {SugExecutiveDto}- The newly updated sug executive
   */
  updateExecutive(
    executive_id: string,
    data: UpdateSugExecutiveRequestBody,
  ): Promise<SugExecutiveDto>;
}
