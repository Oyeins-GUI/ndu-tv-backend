import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsEnum,
  Validate,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { SCOPE } from '../../../shared/enums';
import { AtLeastOneFieldValidator } from '../../../shared/validators/at-least-one-field.validator';

export class CreateSugExecutiveRequestBody {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ example: 'john.smith@ndutv.ng' })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ example: 'UG/21/0456', description: 'Matriculation number' })
  @IsString()
  @Matches(/^UG\/\d{2}\/\d{4}$/, {
    message: 'Matric number must match UG/00/0000 format',
  })
  @IsNotEmpty()
  public matric_number: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the position',
  })
  @IsUUID()
  @IsNotEmpty()
  public position_id: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'UUID of the session',
  })
  @IsUUID()
  @IsNotEmpty()
  public session_id: string;

  @ApiProperty({
    example: 'e7b8c68e-d726-4906-8494-f7f9d5c2c624',
    description: 'UUID of the faculty',
  })
  @IsUUID()
  @IsNotEmpty()
  public faculty_id: string;

  @ApiProperty({
    example: '4d1d1b20-5a4c-4df7-b6c4-bb6e7f3c3011',
    description: 'UUID of the department',
  })
  @IsUUID()
  @IsNotEmpty()
  public department_id: string;

  @ApiProperty({
    example: '+2348012345678',
    description: 'Phone number in international format',
  })
  @IsString()
  @Matches(/^\+234[789][01]\d{8}$/, {
    message: 'Phone number must be a valid Nigerian number in +234 format',
  })
  @IsNotEmpty()
  public phone_number: string;

  @ApiProperty({ enum: SCOPE, example: SCOPE.FACULTY })
  @IsEnum(SCOPE)
  @IsNotEmpty()
  public scope: SCOPE;

  @ApiProperty({
    example: 'https://cdn.ndutv.ng/executives/john-smith.jpg',
    description: 'URL of the executive’s profile image',
  })
  @IsString()
  @IsNotEmpty()
  public image_url: string;
}

// export class GetSugExecutivesQuery {
//   @IsUUID()
//   @IsOptional()
//   public facutly_id?: string;

//   @IsUUID()
//   @IsOptional()
//   public department_id?: string;
// }

export class UpdateSugExecutiveRequestBody extends PartialType(
  CreateSugExecutiveRequestBody,
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}

export class CreateAdminRequestBody {
  @ApiProperty({ description: 'ID of the executive user to assign as admin' })
  @IsString()
  @IsNotEmpty()
  public executive_id: string;

  @ApiProperty({
    example: '4d1d1b20-5a4c-4df7-b6c4-bb6e7f3c3011',
    description: 'Admin role ID',
  })
  @IsString()
  @IsNotEmpty()
  public role_id: string;
}

export class UpdateAdminRequestBody {
  @ApiProperty({
    example: '4d1d1b20-5a4c-4df7-b6c4-bb6e7f3c3011',
    description: 'New admin role ID',
  })
  @IsString()
  @IsNotEmpty()
  public role_id: string;
}
