import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponse,
  createPaginatedResponseDto,
} from '../../../shared/responses/api-response';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { ArticleDto } from './article.dto';
import { ArticleResponseBody } from './base.dto';

export class ArticleApiResponse extends ApiResponse<ArticleDto> {
  @ApiProperty({
    description: 'Article operation response message',
    example: RESPONSE_MESSAGES.Article.Success.Created,
  })
  public override message: string = RESPONSE_MESSAGES.Article.Success.Created;

  @ApiProperty({
    description: 'Article data returned from operation',
    type: ArticleResponseBody,
  })
  public override data: ArticleDto;

  constructor(data: ArticleDto, message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class ArticlesApiResponse extends ApiResponse<ArticleDto[]> {
  @ApiProperty({
    description: 'Article operation response message',
    example: RESPONSE_MESSAGES.Article.Success.Retrieved,
  })
  public override message: string = RESPONSE_MESSAGES.Article.Success.Retrieved;

  @ApiProperty({
    description: 'Article data returned from operation',
    type: [ArticleResponseBody],
  })
  public override data: ArticleDto[];

  constructor(data: ArticleDto[], message?: string) {
    super();
    this.data = data;
    if (message) this.message = message;
  }
}

export class PaginatedArticlesApiResponse extends createPaginatedResponseDto(
  ArticleResponseBody,
) {}
