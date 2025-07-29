import { ApiProperty } from '@nestjs/swagger';
import { SCOPE } from '../../../shared/enums';

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
