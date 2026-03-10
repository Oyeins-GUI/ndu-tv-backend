import { ApiProperty } from '@nestjs/swagger';
import { ArticleCategory } from '../../../shared/enums/article.enum';

export class ArticleResponseBody {
  @ApiProperty({ example: 'John Smith', description: 'Author name' })
  public author_name: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the admin who created the article',
  })
  public admin_id: string;

  @ApiProperty({
    example: 'Article content here...',
    description: 'Full article content',
  })
  public content: string;

  @ApiProperty({
    example: 'A brief summary',
    description: 'Short summary of the article',
  })
  public summary: string;

  @ApiProperty({
    example: 'My Article Title',
    description: 'Title of the article',
  })
  public title: string;

  @ApiProperty({
    example: 'https://cdn.ndutv.ng/articles/image.jpg',
    description: 'URL of the article image',
  })
  public image_url: string;

  @ApiProperty({
    example: 'sports',
    description: 'Article category',
    enum: ArticleCategory,
  })
  public category: ArticleCategory;

  @ApiProperty({
    example: false,
    description: 'Whether the article is featured',
    type: 'boolean',
  })
  public is_featured: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the article is approved',
    type: 'boolean',
  })
  public is_approved: boolean;

  @ApiProperty({
    example: '2025-07-28T15:00:00Z',
    description: 'Date article was created',
    nullable: true,
  })
  public created_at: string | Date | null;
}
