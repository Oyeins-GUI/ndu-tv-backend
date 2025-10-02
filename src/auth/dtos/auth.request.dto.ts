import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({
    description: 'Email address or matric number of the admin',
    example: 'admin@ndu.edu.ng',
  })
  @IsString()
  @IsNotEmpty()
  public identifier: string;

  @ApiProperty({
    description: 'Plaintext password',
    example: 'adminPassword999',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    description: 'Whether to keep the user logged in (optional)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public remember_me?: boolean;
}

export class SetPasswordInitRequestBody {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'Matric number of the user',
    example: 'UG/19/2024',
  })
  @IsString()
  @Matches(/^UG\/\d{2}\/\d{4}$/, {
    message: 'Matric number must match UG/00/0000 format',
  })
  @IsNotEmpty()
  public matric_number: string;
}

export class PasswordConfirmRequestBody {
  @ApiProperty({
    description: 'Password setup or reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  public token: string;

  @ApiProperty({
    description:
      'New password - must be at least 8 characters with uppercase, lowercase, number and special character',
    example: 'StrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  public password: string;
}
