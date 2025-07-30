import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  AdminApiResponse,
  SugExecutiveApiResponse,
} from '../dtos/admin.reponse.dto';
import {
  DepartmentApiResponse,
  DepartmentsApiResponse,
  FacultiesApiResponse,
  FacultyApiResponse,
} from '../dtos/common.response.dto';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import { Public } from '../../../shared/decorators/public.decorator';

export function CreateSugExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add an sug Executive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Created,
      status: HttpStatus.CREATED,
      type: SugExecutiveApiResponse,
    }),
  );
}

export function CreateAdminEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add an admin',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Admin.Success.Created,
      status: HttpStatus.CREATED,
      type: AdminApiResponse,
    }),
  );
}

export function CreateDepartmentEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add a department',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Department.Success.Created,
      status: HttpStatus.CREATED,
      type: DepartmentApiResponse,
    }),
  );
}

export function GetDepartmentsEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get all departments',
      queryParams: [
        {
          name: 'faculty_id',
          required: false,
          description: 'Filter departments by faculty ID',
          example: '550e8400-e29b-41d4-a716-446655440000',
          type: 'string',
        },
      ],
      auth: false,
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Department.Success.Retrieved,
      status: HttpStatus.OK,
      type: DepartmentsApiResponse,
    }),
  );
}

export function UpdateDepartmentEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Update a department',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Department.Success.Updated,
      status: HttpStatus.OK,
      type: DepartmentApiResponse,
    }),
  );
}

export function DeleteDepartmentEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Delete a department',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Department.Success.Deleted,
      status: HttpStatus.OK,
      type: SuccessResponseBody,
    }),
  );
}

export function CreateFacultyEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add a faculty',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Faculty.Success.Created,
      status: HttpStatus.CREATED,
      type: FacultyApiResponse,
    }),
  );
}

export function GetFacultiesEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get all faculties',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      auth: false,
      successMessage: RESPONSE_MESSAGES.Faculty.Success.Retrieved,
      status: HttpStatus.OK,
      type: FacultiesApiResponse,
    }),
  );
}

export function UpdateFacultyEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Update a faculty',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Faculty.Success.Updated,
      status: HttpStatus.OK,
      type: FacultyApiResponse,
    }),
  );
}

export function DeleteFacultyEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Delete a faculty',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Faculty.Success.Deleted,
      status: HttpStatus.NO_CONTENT,
      type: SuccessResponseBody,
    }),
  );
}
