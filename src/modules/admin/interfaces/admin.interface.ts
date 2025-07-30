import { AdminDto } from '../dtos/admin.dto';
import { DepartmentDto, FacultyDto, SugExecutiveDto } from '../dtos/common.dto';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from './department-repository.interface';
import {
  CreateFacultyInput,
  UpdateFacultyInput,
} from './faculty-repository.interface';
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

  /**
   * Adds a new Department
   * @param data - Data to add
   * @returns {DepartmentDto} - The newly added department
   */
  addDepartment(data: CreateDepartmentInput): Promise<DepartmentDto>;

  /**
   * Updates an existing Department
   * @param id - Department ID to update
   * @param data - Data to update
   * @returns {DepartmentDto} - The updated department
   */
  updateDepartment(
    id: string,
    data: UpdateDepartmentInput,
  ): Promise<DepartmentDto>;
  /**
   * Gets all Departments with optional faculty filter
   * @param faculty_id - Optional faculty ID to filter by
   * @returns {DepartmentDto[]} - List of departments (filtered by faculty if provided)
   */
  getDepartments(faculty_id?: string): Promise<DepartmentDto[]>;

  /**
   * Deletes a Department
   * @param id - Department ID to delete
   * @returns {void}
   */
  deleteDepartment(id: string): Promise<void>;

  /**
   * Adds a new Faculty
   * @param data - Data to add
   * @returns {FacultyDto} - The newly added faculty
   */
  addFaculty(data: CreateFacultyInput): Promise<FacultyDto>;

  /**
   * Updates an existing Faculty
   * @param id - Faculty ID to update
   * @param data - Data to update
   * @returns {FacultyDto} - The updated faculty
   */
  updateFaculty(id: string, data: UpdateFacultyInput): Promise<FacultyDto>;

  /**
   * Gets all Faculties
   * @returns {FacultyDto[]} - List of all faculties
   */
  getFaculties(): Promise<FacultyDto[]>;

  /**
   * Deletes a Faculty
   * @param id - Faculty ID to delete
   * @returns {void}
   */
  deleteFaculty(id: string): Promise<void>;

  /**
   * Gets a single Faculty by ID
   * @param id - Faculty ID to retrieve
   * @returns {FacultyDto} - The faculty data
   */
  getFaculty(id: string): Promise<FacultyDto>;
}

export type AddAdminInput = {
  executive_id: string;
  role_id: string;
};
