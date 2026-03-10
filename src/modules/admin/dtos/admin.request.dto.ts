import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  Validate,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { AtLeastOneFieldValidator } from '../../../shared/validators/at-least-one-field.validator';

export class CreateNansExecutiveRequestBody {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ example: '2023' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^20\d{2}$/)
  public year: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the position',
  })
  @IsUUID()
  @IsNotEmpty()
  public position_id: string;

  @ApiProperty({
    example: 'https://cdn.ndutv.ng/executives/john-smith.jpg',
    description: 'URL of the executive’s profile image',
  })
  @IsString()
  @IsNotEmpty()
  public image_url: string;
}

export class UpdateNansExecutiveRequestBody extends PartialType(
  CreateNansExecutiveRequestBody,
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}

export class CreateAdminRequestBody {
  @ApiProperty({
    description: 'Email of the user',
    example: 'jonhdoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    example: '9904faf9-8e10-4fc7-b584-ba9c87f55a1c',
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
  @IsOptional()
  public role_id: string;

  @ApiProperty({
    example: false,
    description: 'Disable or enables admin',
  })
  @IsBoolean()
  @IsOptional()
  public is_admin_enabled: boolean;

  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}
