import { ApiProperty } from '@nestjs/swagger';

export abstract class ApiResponse<T> {
  @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
  success = true;

  @ApiProperty({ required: false, description: 'Response message' })
  message?: string;

  abstract data: T;

  constructor(message?: string) {
    if (message) this.message = message;
  }
}

class PaginationMeta {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  total_items: number;

  @ApiProperty({ example: 2, description: 'Current page number' })
  current_page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  total_pages: number;

  @ApiProperty({ example: 3, description: 'Next page number', required: false, nullable: true })
  next_page?: number | null;

  @ApiProperty({ example: 1, description: 'Previous page number', required: false, nullable: true })
  prev_page?: number | null;
}

export abstract class PaginatedResponse<T> extends ApiResponse<T[]> {
  @ApiProperty({ type: [Object], description: 'Array of data items' })
  data: T[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  pagination: PaginationMeta;

  constructor(
    data: T[],
    total_items: number,
    current_page: number,
    limit: number,
    message?: string,
  ) {
    super(message);
    this.data = data;

    const total_pages = Math.ceil(total_items / limit);

    this.pagination = {
      total_items,
      current_page,
      limit,
      total_pages,
      next_page: current_page < total_pages ? current_page + 1 : null,
      prev_page: current_page > 1 ? current_page - 1 : null,
    };
  }
}
