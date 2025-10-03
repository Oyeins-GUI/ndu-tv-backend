import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  Validate,
  IsAlpha,
  IsUppercase,
  IsUUID,
  IsBoolean,
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

export class PlatformConfigRequestBody {
  @ApiProperty({
    description: 'ID of the current session',
    example: '550e8400-e29b-41d4-a716-446655440001',
    type: 'string',
  })
  @IsUUID()
  @IsNotEmpty()
  public current_session_id: string;

  @ApiProperty({
    description: 'Article publishing status',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  public is_publishing_enabled: boolean;

  @ApiProperty({
    description: 'Platform Name',
    example: 'ndu-tv',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  public platform_name: string;

  @ApiProperty({
    description: 'Platform tag line',
    example: 'news source',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  public platform_tagline: string;
}

export class UpdatePlatformConfigRequestBody extends PartialType(
  PlatformConfigRequestBody,
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}
