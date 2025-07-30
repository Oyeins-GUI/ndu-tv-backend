import { ApiProperty } from '@nestjs/swagger';
import { SCOPE } from '../../../shared/enums';

export class AdminResponseBody {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the admin' })
  public name: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Email address' })
  public email: string;

  @ApiProperty({
    example: 'NDU/1234/2020',
    description: 'Matric number of the admin',
  })
  public matric_number: string;

  @ApiProperty({ example: 'System Admin', description: 'Admin role/title' })
  public role: string;

  @ApiProperty({
    example: 'President',
    description: 'Position held by the admin',
  })
  public position: string;

  @ApiProperty({
    example: 'Engineering',
    description: 'Faculty the admin belongs to',
  })
  public faculty: string;

  @ApiProperty({
    example: 'Electrical Engineering',
    description: 'Department of the admin',
  })
  public deparment: string;

  @ApiProperty({ enum: SCOPE, description: 'Scope of access' })
  public scope: string;

  @ApiProperty({ example: true, description: 'Whether the admin is active' })
  public is_active: boolean;

  @ApiProperty({
    example: '2025-07-28T15:00:00Z',
    description: 'Last login timestamp (ISO)',
    nullable: true,
  })
  public last_login_at: string | Date | null;
}

export class SugExecutiveResponseBody {
  @ApiProperty({
    example: 'John Smith',
    description: 'Full name of the executive',
  })
  public name: string;

  @ApiProperty({
    example: 'john.smith@ndutv.ng',
    description: 'Email address of the executive',
  })
  public email: string;

  @ApiProperty({
    example: 'NDU/2021/04567',
    description: 'Matric number of the executive',
  })
  public matric_number: string;

  @ApiProperty({ example: '+2348012345678', description: 'Phone number' })
  public phone_number: string;

  @ApiProperty({
    example: '2023/2024',
    description: 'Academic session assigned',
  })
  public session: string;

  @ApiProperty({
    example: 'President',
    description: 'Title or position in student government',
  })
  public position: string;

  @ApiProperty({ example: 'Management Sciences', description: 'Faculty name' })
  public faculty: string;

  @ApiProperty({ example: 'Accounting', description: 'Department name' })
  public deparment: string;

  @ApiProperty({
    enum: SCOPE,
    example: SCOPE.FACULTY,
    description: 'Scope of representation',
  })
  public scope: string;

  @ApiProperty({
    example: 'https://cdn.ndutv.ng/executives/john-smith.jpg',
    description: 'URL of the executive’s profile image',
  })
  public image_url: string;
}

export class DepartmentResponseBody {
  @ApiProperty({
    description: 'Department ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  public id: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Computer Science',
  })
  public department: string;

  @ApiProperty({
    description: 'Department options/programs',
    example: ['Software Engineering', 'Cybersecurity', 'Data Science'],
    type: [String],
    nullable: true,
  })
  public options?: string[] | null;

  @ApiProperty({
    description: 'Faculty name',
    example: 'Faculty of Science',
  })
  public faculty: string;
}

export class FacultyResponseBody {
  @ApiProperty({
    description: 'Faculty ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  public id: string;

  @ApiProperty({
    description: 'Faculty name',
    example: 'Faculty of Science',
  })
  public faculty: string;

  @ApiProperty({
    description: 'Departments under this faculty',
    example: ['Computer Science', 'Mathematics', 'Physics'],
    required: false,
    type: [String],
  })
  public departments?: string[];
}
