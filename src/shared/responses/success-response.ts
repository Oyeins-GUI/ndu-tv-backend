import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api-response';

export class SuccessResponseBody<T = null> extends ApiResponse<T> {
  @ApiProperty({
    example: 'Operation successful',
    description: 'A general success message for the operation.',
  })
  public override message?: string = 'Operation successful';

  public override data: T;

  constructor(data: T, message?: string) {
    super(message);
    this.message = message;
    this.data = data;
  }
}
