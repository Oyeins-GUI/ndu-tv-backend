import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({
    description: 'Email address or matric number of the admin',
    example: 'admin@example.com',
  })
  @IsString()
  @IsNotEmpty()
  public identifier: string;

  @ApiProperty({
    description: 'Plaintext password',
    example: 'StrongPassword123!',
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
