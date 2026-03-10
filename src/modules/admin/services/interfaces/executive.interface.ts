import { ExecType } from '../../../../shared/enums/execs.enum';
import { PaginationInput } from '../../../../shared/types/repositories.types';
import {
  CreateNansExecutiveRequestBody,
  UpdateNansExecutiveRequestBody,
} from '../../dtos/admin.request.dto';
import { NansExecutiveDto, NansPostionDto } from '../../dtos/common.dto';
import { CreateNansPositionRequestBody } from '../../dtos/common.request.dto';

export interface IExecutiveService {
  /**
   * Adds a new Executive
   * @param data- Data to add
   * @returns {NansExecutiveDto} - The newly added executive
   */
  addExecutive(data: CreateNansExecutiveRequestBody): Promise<NansExecutiveDto>;

  /**
   * Gets Executive for the current session
   * @returns {NansExecutiveDto} - The exectutives matching the fitler constraints
   */
  getExecutives(filters: GetExecutiveFilters): Promise<NansExecutiveDto[]>;

  /**
   * Gets Executive for the current session by id
   * @returns {NansExecutiveDto} - The exectutives matching the fitler constraints
   */
  getExecutive(executive_id: string): Promise<NansExecutiveDto>;

  /**
   * Adds a Nans position
   * @param data- Data to add
   * @returns {NansPositionDto} - The newly addded Nans position
   */
  addNansPostion(data: CreateNansPositionRequestBody): Promise<NansPostionDto>;

  /**
   * Updates an Nans Position
   * @param Nans_position_id- ID of Nans Position to update
   * @param data- Data to update by
   * @returns {NansPositionDto} - The newly addded Nans position
   */
  updateNansPostion(
    Nans_position_id: string,
    data: UpdateNansExecutiveRequestBody,
  ): Promise<NansPostionDto>;

  /**
   * Delete am Nans Exectuive
   * @param executive_id - ID of Nans excutive to delete
   */
  deleteExecutive(executive_id: string): Promise<void>;

  /**
   * Gets Nans position
   * @returns {NansPositionDto} - The the Nans positions available
   */
  getNansPostions(): Promise<NansPostionDto[]>;

  /**
   * Updates an Nans Executive data
   * @param executive_id - ID of the execuvitve data
   * @param data - Data to update
   * @returns {NansExecutiveDto}- The newly updated Nans executive
   */
  updateExecutive(
    executive_id: string,
    data: UpdateNansExecutiveRequestBody,
  ): Promise<NansExecutiveDto>;
}

export type GetExecutiveFilters = PaginationInput & {
  year?: string;
  position_id?: string;
  search_term?: string;
  exec_type?: ExecType;
};
