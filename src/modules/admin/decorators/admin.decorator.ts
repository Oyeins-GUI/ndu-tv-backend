import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  AdminApiResponse,
  AdminsApiResponse,
  NansExecutiveApiResponse,
  NansExecutivesApiResponse,
} from '../dtos/admin.reponse.dto';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import { RoleDto, NansPostionDto } from '../dtos/common.dto';
import { PlatformConfigApiResponse } from '../dtos/common.response.dto';
import { Public } from '../../../shared/decorators/public.decorator';

export function GetNansExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Get a nans exectuive by thier id',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.NansExecutive.Success.Retrieved,
      status: HttpStatus.CREATED,
      type: NansExecutiveApiResponse,
    }),
  );
}

export function GetNansExecutivesEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get Nans exectuive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.NansExecutive.Success.Retrieved,
      status: HttpStatus.CREATED,
      type: NansExecutiveApiResponse,
      queryParams: [
        {
          name: 'q',
          type: 'string',
          description: 'search parameter',
          required: false,
        },
        {
          name: 'year',
          type: 'string',
          example: '2020',
          description: 'executives for specific year',
          required: false,
        },

        {
          name: 'type',
          type: 'string',
          example: 'zonal',
          description: 'type of executives',
          required: false,
        },
      ],
    }),
  );
}

export function CreateNansExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Add an Nans Executive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.NansExecutive.Success.Created,
      status: HttpStatus.CREATED,
      type: NansExecutiveApiResponse,
    }),
  );
}

export function UpdateNansExecutiveEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Updates an Nans Executives',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
      ],
      successMessage: RESPONSE_MESSAGES.NansExecutive.Success.Updated,
      status: HttpStatus.OK,
      type: NansExecutivesApiResponse,
    }),
  );
}

export function DeleteNansExecutiveEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    StandardDocs({
      summary: 'Deltes an Nans Executive',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.NansExecutive.Success.Deleted,
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
export function GetAdminsEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Gets all current admin',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Admin.Success.Retrieved,
      status: HttpStatus.OK,
      type: AdminsApiResponse,
    }),
  );
}

export function UpdateAdminEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Update an admin',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.CONFLICT,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
        ErrorType.NOT_FOUND,
      ],
      successMessage: RESPONSE_MESSAGES.Admin.Success.Updated,
      status: HttpStatus.OK,
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

export function GetNansPositionsEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Gets Nans Positions',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.NansPosition.Success.Retrieved,
      status: HttpStatus.OK,
      type: SuccessResponseBody<NansPostionDto[]>,
    }),
  );
}

export function CreateNansPositionEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    StandardDocs({
      summary: 'Adds an Nans Position',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.NansPosition.Success.Created,
      status: HttpStatus.CREATED,
      type: SuccessResponseBody<NansPostionDto>,
    }),
  );
}

export function UpdateNansPositionEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    StandardDocs({
      summary: 'Updates an Nans Position',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR, ErrorType.UNAUTHORIZED],
      successMessage: RESPONSE_MESSAGES.NansPosition.Success.Updated,
      status: HttpStatus.OK,
      type: SuccessResponseBody<NansPostionDto>,
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
