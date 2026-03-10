import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { AdminResponseBody, NansExecutiveResponseBody } from './base.dto';
import {
  ApiResponse,
  createPaginatedResponseDto,
} from '../../../shared/responses/api-response';

import { AdminDto } from './admin.dto';
import { NansExecutiveDto } from './common.dto';

export class NansExecutiveApiResponse extends ApiResponse<NansExecutiveDto> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.NansExecutive.Success.Created,
  })
  public override message: string =
    RESPONSE_MESSAGES.NansExecutive.Success.Created;

  @ApiProperty({
    description: 'Executive data returned from operation',
    type: NansExecutiveResponseBody,
  })
  public override data: NansExecutiveDto;

  constructor(data: NansExecutiveDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class PaginatedNansExecutivesApiResponse extends createPaginatedResponseDto(
  NansExecutiveResponseBody,
) {}

export class NansExecutivesApiResponse extends ApiResponse<NansExecutiveDto[]> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.NansExecutive.Success.Retrieved,
  })
  public override message: string =
    RESPONSE_MESSAGES.NansExecutive.Success.Retrieved;

  @ApiProperty({
    description: 'Executive data returned from operation',
    type: [NansExecutiveResponseBody],
  })
  public override data: NansExecutiveDto[];

  constructor(data: NansExecutiveDto[], message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class AdminApiResponse extends ApiResponse<AdminDto> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.Admin.Success.Created,
  })
  public override message: string = RESPONSE_MESSAGES.Admin.Success.Created;

  @ApiProperty({
    description: 'Admin data returned from operation',
    type: AdminResponseBody,
  })
  public override data: AdminDto;

  constructor(data: AdminDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class AdminsApiResponse extends ApiResponse<AdminDto[]> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.Admin.Success.Retrieved,
  })
  public override message: string = RESPONSE_MESSAGES.Admin.Success.Retrieved;

  @ApiProperty({
    description: 'Admin data returned from operation',
    type: [AdminResponseBody],
  })
  public override data: AdminDto[];

  constructor(data: AdminDto[], message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}
