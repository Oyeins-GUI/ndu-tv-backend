import { ApiProperty } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { DepartmentResponseBody, FacultyResponseBody } from './base.dto';
import { DepartmentDto, FacultyDto } from './common.dto';
import { ApiResponse } from '../../../shared/responses/api-response';

export class DepartmentApiResponse extends ApiResponse<DepartmentDto> {
  @ApiProperty({
    description: 'Department operation response message',
    example: RESPONSE_MESSAGES.Department.Success.Created,
  })
  public override message: string =
    RESPONSE_MESSAGES.Department.Success.Created;

  @ApiProperty({
    description: 'Department data returned from operation',
    type: DepartmentResponseBody,
  })
  public override data: DepartmentDto;

  constructor(data: DepartmentDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class DepartmentsApiResponse extends ApiResponse<DepartmentDto[]> {
  @ApiProperty({
    description: 'Departments operation response message',
    example: RESPONSE_MESSAGES.Department.Success.Retrieved,
  })
  public override message: string =
    RESPONSE_MESSAGES.Department.Success.Retrieved;

  @ApiProperty({
    description: 'Array of department data returned from operation',
    type: [DepartmentResponseBody],
  })
  public override data: DepartmentDto[];

  constructor(data: DepartmentDto[], message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class FacultyApiResponse extends ApiResponse<FacultyDto> {
  @ApiProperty({
    description: 'Faculty operation response message',
    example: RESPONSE_MESSAGES.Faculty.Success.Created,
  })
  public override message: string = RESPONSE_MESSAGES.Faculty.Success.Created;

  @ApiProperty({
    description: 'Faculty data returned from operation',
    type: FacultyResponseBody,
  })
  public override data: FacultyDto;

  constructor(data: FacultyDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class FacultiesApiResponse extends ApiResponse<FacultyDto[]> {
  @ApiProperty({
    description: 'Faculties operation response message',
    example: RESPONSE_MESSAGES.Faculty.Success.Retrieved,
  })
  public override message: string = RESPONSE_MESSAGES.Faculty.Success.Retrieved;

  @ApiProperty({
    description: 'Array of faculty data returned from operation',
    type: [FacultyResponseBody],
  })
  public override data: FacultyDto[];

  constructor(data: FacultyDto[], message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}
