import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { AdminResponseBody, SugExecutiveResponseBody } from './base.dto';
import {
  ApiResponse,
  createPaginatedResponseDto,
} from '../../../shared/responses/api-response';
import { SugExecutiveDto } from './common.dto';
import { AdminDto } from './admin.dto';

export class SugExecutiveApiResponse extends ApiResponse<SugExecutiveDto> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.SugExecutive.Success.Created,
  })
  public override message: string =
    RESPONSE_MESSAGES.SugExecutive.Success.Created;

  @ApiProperty({
    description: 'Executive data returned from operation',
    type: SugExecutiveResponseBody,
  })
  public override data: SugExecutiveDto;

  constructor(data: SugExecutiveDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class PaginatedSugExecutivesApiResponse extends createPaginatedResponseDto(
  SugExecutiveResponseBody,
) {}

export class SugExecutivesApiResponse extends ApiResponse<SugExecutiveDto[]> {
  @ApiProperty({
    description: 'Executive operation response message',
    example: RESPONSE_MESSAGES.SugExecutive.Success.Retrieved,
  })
  public override message: string =
    RESPONSE_MESSAGES.SugExecutive.Success.Retrieved;

  @ApiProperty({
    description: 'Executive data returned from operation',
    type: [SugExecutiveResponseBody],
  })
  public override data: SugExecutiveDto[];

  constructor(data: SugExecutiveDto[], message?: string) {
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
    description: 'Executive data returned from operation',
    type: AdminResponseBody,
  })
  public override data: AdminDto;

  constructor(data: AdminDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}
