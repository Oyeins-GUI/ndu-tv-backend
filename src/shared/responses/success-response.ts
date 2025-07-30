import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from './api-response';

export class SuccessResponseBody<T = null | undefined> extends ApiResponse<
  T | undefined
> {
  @ApiProperty({
    example: 'Operation successful',
    description: 'A general success message for the operation.',
  })
  public override message?: string = 'Operation successful';

  public override data: T;

  constructor({ data, message }: { data?: T; message?: string }) {
    super(message);
    this.message = message;
    if (data) this.data = data;
  }
}
