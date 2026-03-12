import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseBody {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the admin' })
  public name: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Email address' })
  public email: string;

  @ApiProperty({ example: 'System Admin', description: 'Admin role/title' })
  public role: string;

  @ApiProperty({
    description: 'Admin active status',
    example: false,
    type: 'boolean',
  })
  public is_admin_enabled: boolean;

  @ApiProperty({
    example: '2025-07-28T15:00:00Z',
    description: 'Last login timestamp (ISO)',
    nullable: true,
  })
  public last_login_at: string | Date | null;
}

export class NansExecutiveResponseBody {
  @ApiProperty({
    example: 'John Smith',
    description: 'Full name of the executive',
  })
  public name: string;

  @ApiProperty({
    example: '2023',
    description: 'year position was held assigned',
  })
  public year: string;

  @ApiProperty({
    example: 'President',
    description: 'Title or position in student government',
  })
  public position?: string;

  @ApiProperty({
    example: 'https://cdn.ndutv.ng/executives/john-smith.jpg',
    description: 'URL of the executive’s profile image',
  })
  public image_url: string;

  @ApiProperty({
    example: 'zonal',
    description: 'Category of the executive',
  })
  public exec_type: string;
}

export class PlatformConfigResponseBody {
  @ApiProperty({
    description: 'App Enablement status',
    example: true,
    type: 'boolean',
  })
  public is_app_enabled: boolean;

  @ApiProperty({
    description: 'Advertisment Enablement status',
    example: true,
    type: 'boolean',
  })
  public is_add_enabled: boolean;

  @ApiProperty({
    description: 'Article publishing status',
    example: true,
    type: 'boolean',
  })
  public is_publishing_enabled: boolean;

  @ApiProperty({
    description: 'Platform Name',
    example: 'ndu-tv',
    type: 'string',
  })
  public platform_name: string;

  @ApiProperty({
    description: 'Platform tag line',
    example: 'news source',
    type: 'string',
  })
  public platform_tagline: string;
}
