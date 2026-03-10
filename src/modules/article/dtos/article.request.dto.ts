import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsBoolean,
  Validate,
} from 'class-validator';
import { ArticleCategory } from '../../../shared/enums/article.enum';
import { AtLeastOneFieldValidator } from '../../../shared/validators/at-least-one-field.validator';

export class CreateArticleRequestBody {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  public author_name: string;

  @ApiProperty({ example: 'Article content here...' })
  @IsString()
  @IsNotEmpty()
  public content: string;

  @ApiProperty({ example: 'A brief summary of the article' })
  @IsString()
  @IsNotEmpty()
  public summary: string;

  @ApiProperty({ example: 'My Article Title' })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ example: 'sports', enum: ArticleCategory })
  @IsEnum(ArticleCategory)
  @IsNotEmpty()
  public category: ArticleCategory;

  @ApiProperty({ example: 'https://cdn.ndutv.ng/articles/image.jpg' })
  @IsString()
  @IsNotEmpty()
  public image_url: string;
}

export class UpdateArticleRequestBody extends PartialType(
  OmitType(CreateArticleRequestBody, ['author_name'] as const),
) {
  @Validate(AtLeastOneFieldValidator)
  public __self__: any;
}
