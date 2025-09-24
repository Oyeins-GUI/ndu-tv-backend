import { SCOPE } from '../../../../shared/enums';
import {
  CreateSugExecutiveRequestBody,
  UpdateSugExecutiveRequestBody,
} from '../../dtos/admin.request.dto';
import { SugExecutiveDto, SugPostionDto } from '../../dtos/common.dto';
import { CreateSugPositionRequestBody } from '../../dtos/common.request.dto';

export interface IExecutiveService {
  /**
   * Adds a new Executive
   * @param data- Data to add
   * @returns {SugExecutiveDto} - The newly added executive
   */
  addExecutive(data: CreateSugExecutiveRequestBody): Promise<SugExecutiveDto>;

  /**
   * Gets Executive for the current session
   * @returns {SugExecutiveDto} - The exectutives matching the fitler constraints
   */
  getExecutives({
    scope,
    faculty_id,
    department_id,
  }: {
    scope: SCOPE;
    faculty_id?: string;
    department_id?: string;
  }): Promise<SugExecutiveDto[]>;

  /**
   * Gets Executive for the current session by id
   * @returns {SugExecutiveDto} - The exectutives matching the fitler constraints
   */
  getExecutive(executive_id: string): Promise<SugExecutiveDto>;

  /**
   * Adds a sug position
   * @param data- Data to add
   * @returns {SugPositionDto} - The newly addded Sug position
   */
  addSugPostion(data: CreateSugPositionRequestBody): Promise<SugPostionDto>;

  /**
   * Updates an Sug Position
   * @param sug_position_id- ID of SUG Position to update
   * @param data- Data to update by
   * @returns {SugPositionDto} - The newly addded Sug position
   */
  updateSugPostion(
    sug_position_id: string,
    data: UpdateSugExecutiveRequestBody,
  ): Promise<SugPostionDto>;

  /**
   * Delete am Sug Exectuive
   * @param executive_id - ID of sug excutive to delete
   */
  deleteExecutive(executive_id: string): Promise<void>;

  /**
   * Gets Sug position
   * @returns {SugPositionDto} - The the sug positions available
   */
  getSugPostions(): Promise<SugPostionDto[]>;

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
