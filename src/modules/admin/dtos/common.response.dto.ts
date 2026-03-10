import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { PlatformConfigResponseBody } from './base.dto';

import { ApiResponse } from '../../../shared/responses/api-response';
import { PlatformConfigDto } from './common.dto';

export class PlatformConfigApiResponse extends ApiResponse<PlatformConfigDto> {
  @ApiProperty({
    description: 'Platfrom Configuration info',
    example: RESPONSE_MESSAGES.PlatformConfig.Success.Retrieved,
    type: 'string',
  })
  public override message: string =
    RESPONSE_MESSAGES.PlatformConfig.Success.Retrieved;

  @ApiProperty({
    description: 'Platform data returned from operation',
    type: PlatformConfigResponseBody,
  })
  public override data: PlatformConfigDto;

  constructor(data: PlatformConfigDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}
