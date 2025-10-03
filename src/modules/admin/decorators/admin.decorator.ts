import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  AdminApiResponse,
  SugExecutiveApiResponse,
  SugExecutivesApiResponse,
} from '../dtos/admin.reponse.dto';
import {
  DepartmentApiResponse,
  DepartmentsApiResponse,
  FacultiesApiResponse,
  FacultyApiResponse,
  PlatformConfigApiResponse,
} from '../dtos/common.response.dto';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import { Public } from '../../../shared/decorators/public.decorator';
import { AcademicSessionDto, RoleDto, SugPostionDto } from '../dtos/common.dto';

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

export function GetSugExecutivesEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary:
        'Gets SUG Executives (Depending on the scope, central, faculty, deparment)',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Retrieved,
      status: HttpStatus.OK,
      type: SugExecutivesApiResponse,
    }),
  );
}

export function UpdateSugExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Updates an SUG Executives',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Updated,
      status: HttpStatus.OK,
      type: SugExecutivesApiResponse,
    }),
  );
}

export function DeleteSugExecutiveEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    StandardDocs({
      summary: 'Deltes an SUG Executive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.SugExecutive.Success.Deleted,
      status: HttpStatus.NO_CONTENT,
      type: SuccessResponseBody,
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

export function RemoveAdminEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    StandardDocs({
      summary: 'Add an admin',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Admin.Success.Deleted,
      status: HttpStatus.NO_CONTENT,
      type: SuccessResponseBody,
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

export function GetDepartmentEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get a department by its id',
      auth: false,
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR],
      successMessage: RESPONSE_MESSAGES.Department.Success.Retrieved,
      status: HttpStatus.OK,
      type: DepartmentApiResponse,
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

export function GetFacultyEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Gets a single Faculty by its ID',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      auth: false,
      successMessage: RESPONSE_MESSAGES.Faculty.Success.Retrieved,
      status: HttpStatus.OK,
      type: FacultyApiResponse,
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

export function GetRolesEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Gets Roles',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Role.Success.Retrieved,
      status: HttpStatus.OK,
      type: SuccessResponseBody<RoleDto[]>,
    }),
  );
}

export function GetSessionsEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Gets academic sessions',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR],
      successMessage: RESPONSE_MESSAGES.AcademicSession.Success.Retrieved,
      status: HttpStatus.OK,
      type: SuccessResponseBody<AcademicSessionDto[]>,
    }),
  );
}

export function GetSugPositionsEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Gets SUG Positions',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.SugPosition.Success.Retrieved,
      status: HttpStatus.OK,
      type: SuccessResponseBody<SugPostionDto[]>,
    }),
  );
}

export function CreateSugPositionEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    StandardDocs({
      summary: 'Adds an SUG Position',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.SugPosition.Success.Created,
      status: HttpStatus.CREATED,
      type: SuccessResponseBody<SugPostionDto>,
    }),
  );
}

export function UpdateSugPositionEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    StandardDocs({
      summary: 'Updates an SUG Position',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.SugPosition.Success.Updated,
      status: HttpStatus.OK,
      type: SuccessResponseBody<SugPostionDto>,
    }),
  );
}

export function UpdatePlatformConfigEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    StandardDocs({
      summary: 'Update Plaform configuration and info',
      includeErrors: [
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.UNAUTHORIZED,
        ErrorType.BAD_REQUEST,
      ],
      successMessage: RESPONSE_MESSAGES.PlatformConfig.Success.Updated,
      status: HttpStatus.OK,
      type: PlatformConfigApiResponse,
    }),
  );
}

export function GetPlatformConfigEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    StandardDocs({
      summary: 'Retrieve Plaform configuration and info',
      includeErrors: [
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.UNAUTHORIZED,
        ErrorType.BAD_REQUEST,
      ],
      successMessage: RESPONSE_MESSAGES.PlatformConfig.Success.Retrieved,
      status: HttpStatus.OK,
      type: PlatformConfigApiResponse,
    }),
  );
}
