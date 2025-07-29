import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SugExecutiveResponseBody } from './base.dto';
import { ApiResponse } from '../../../shared/responses/api-response';
import { SugExecutiveDto } from './common.dto';

export class SugExecutiveApiResponse extends ApiResponse<SugExecutiveResponseBody> {
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
