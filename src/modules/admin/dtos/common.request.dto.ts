import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  Validate,
  IsAlpha,
  IsUppercase,
} from 'class-validator';
import { AtLeastOneFieldValidator } from '../../../shared/validators/at-least-one-field.validator';

export class CreateDepartmentRequestBody {
  @ApiProperty({
    description: 'Faculty ID that the department belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  public faculty_id: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  public department: string;

  @ApiProperty({
    description: 'Department options/programs (optional)',
    example: ['Software Engineering', 'Cybersecurity', 'Data Science'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public options?: string[] | null;
}

export class UpdateDepartmentRequestBody extends PartialType(
  CreateDepartmentRequestBody,
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}

export class CreateFacultyRequestBody {
  @ApiProperty({
    description: 'Faculty name',
    example: 'Faculty of Science',
  })
  @IsString()
  @IsNotEmpty()
  public faculty: string;
}

export class CreateSugPositionRequestBody {
  @ApiProperty({
    description: 'Sug Position abbrevetion',
    example: 'PRO',
  })
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  public position: string;

  @ApiProperty({
    description: 'Sug Position full name',
    example: 'President',
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    description: 'Sug Position full duties',
    example: 'President oversees the entire union',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class UpdateSugPositionRequestBody extends PartialType(
  CreateSugPositionRequestBody,
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}
