import { DepartmentDto, FacultyDto } from '../../dtos/common.dto';
import {
  CreateDepartmentRequestBody,
  CreateFacultyRequestBody,
  UpdateDepartmentRequestBody,
} from '../../dtos/common.request.dto';

export interface IAcademicService {
  /**
   * Adds a new Department
   * @param data - Data to add
   * @returns {DepartmentDto} - The newly added department
   */
  addDepartment(data: CreateDepartmentRequestBody): Promise<DepartmentDto>;

  /**
   * Updates an existing Department
   * @param id - Department ID to update
   * @param data - Data to update
   * @returns {DepartmentDto} - The updated department
   */
  updateDepartment(
    id: string,
    data: UpdateDepartmentRequestBody,
  ): Promise<DepartmentDto>;

  /**
   * Gets a department by its id
   * @param department_id - ID of department to get
   * @returns - The Department instance if found
   */
  getDepartment(department_id: string): Promise<DepartmentDto>;

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
  addFaculty(data: CreateFacultyRequestBody): Promise<FacultyDto>;

  /**
   * Updates an existing Faculty
   * @param id - Faculty ID to update
   * @param data - Data to update
   * @returns {FacultyDto} - The updated faculty
   */
  updateFaculty(
    id: string,
    data: CreateFacultyRequestBody,
  ): Promise<FacultyDto>;

  /**
   * Gets a Faculty by its ID
   * @param faculty_id - ID of the Faculty to get
   * @returns - Faculty instance if found
   */
  getFaculty(faculty_id: string): Promise<FacultyDto>;

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
