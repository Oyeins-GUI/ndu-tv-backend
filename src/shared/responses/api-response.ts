import { ApiProperty } from '@nestjs/swagger';

export abstract class ApiResponse<T> {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success = true;

  @ApiProperty({ required: false, description: 'Response message' })
  message?: string;

  abstract data: T;

  constructor(message?: string) {
    if (message) this.message = message;
  }
}

class PaginationMeta {
  @ApiProperty({ example: 2, description: 'Current page number' })
  current_page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({
    example: true,
    type: 'boolean',
    description: 'If there is a next page',
    required: false,
  })
  has_next_page?: boolean;

  @ApiProperty({
    example: false,
    type: 'boolean',
    description: 'If there is a previous page',
    required: false,
  })
  has_prev_page?: boolean;
}

export abstract class PaginatedResponse<T> extends ApiResponse<T[]> {
  public data: T[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  public pagination: PaginationMeta;

  constructor({
    data,
    page,
    limit,
    message,
  }: {
    data: T[];
    page: number;
    limit: number;
    message?: string;
  }) {
    super(message);

    if (data.length > limit) {
      data.pop();
    }

    this.data = data;

    this.pagination = {
      current_page: page,
      limit,
      has_next_page: data.length > limit,
      has_prev_page: page > 1,
    };
  }
}

export function calculatePaginationOffset(page: number, limit: number) {
  return (page - 1) * limit;
}

export function calculatePaginationLimit(limit: number) {
  return limit + 1;
}

export function createPaginatedResponseDto<T>(
  itemType: new () => T,
  description?: string,
) {
  class PaginatedResponseBody extends PaginatedResponse<T> {
    @ApiProperty({
      description: description ?? 'Paginated data',
      type: [itemType],
    })
    declare public data: T[];
  }

  return PaginatedResponseBody;
}
