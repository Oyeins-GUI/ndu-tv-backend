import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseReason<TDetails = any> {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({ example: 'Validation failed' })
  reason: string;

  @ApiProperty({ required: false, nullable: true })
  details?: TDetails;
}

export class ApiErrorResponseBody<TDetails = any> {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 'Error message' })
  message: string;

  data: null;

  @ApiProperty({
    description: 'Error reason',
    type: () => ErrorResponseReason,
  })
  error: ErrorResponseReason<TDetails>;
}
