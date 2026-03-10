import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Validate,
  IsUppercase,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { AtLeastOneFieldValidator } from '../../../shared/validators/at-least-one-field.validator';

export class CreateNansPositionRequestBody {
  @ApiProperty({
    description: 'Nans Position abbrevetion',
    example: 'PRO',
  })
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  public position: string;

  @ApiProperty({
    description: 'Nans Position full name',
    example: 'President',
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    description: 'Nans Position full duties',
    example: 'President oversees the entire union',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class UpdateNansPositionRequestBody extends PartialType(
  CreateNansPositionRequestBody,
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
