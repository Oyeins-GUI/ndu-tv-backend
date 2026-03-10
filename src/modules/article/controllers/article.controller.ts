import {
  Controller,
  Inject,
  Get,
  Query,
  UseGuards,
  Req,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticleCategory } from '../../../shared/enums/article.enum';
import { SuperAdminGuard } from '../../../shared/guards/super-admin.guard';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import {
  CreateArticleRequestBody,
  UpdateArticleRequestBody,
} from '../dtos/article.request.dto';
import {
  ArticlesApiResponse,
  ArticleApiResponse,
} from '../dtos/article.response.dto';
import { IArticleService } from '../services/interfaces/article.interface';
import { Request } from 'express';
import {
  GetArticlesEndpoint,
  GetArticlesSuperAdminEndpoint,
  GetArticlesByAdminEndpoint,
  GetArticleEndpoint,
  CreateArticleEndpoint,
  UpdateArticleEndpoint,
  DeleteArticleEndpoint,
} from '../decorators/article.decorator';

@Controller('articles')
@ApiTags('Articles')
export class ArticleController {
  constructor(
    @Inject('IArticleService')
    private readonly articleService: IArticleService,
  ) {}

  @Get()
  @GetArticlesEndpoint()
  public async getArticles(
    @Query('q') search?: string,
    @Query('category') category?: ArticleCategory,
    @Query('is_featured') is_featured?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ArticlesApiResponse> {
    const result = await this.articleService.getArticles({
      search,
      category,
      is_featured,
      page,
      limit,
    });
    return new ArticlesApiResponse(result);
  }

  @Get('super-admin')
  @UseGuards(SuperAdminGuard)
  @GetArticlesSuperAdminEndpoint()
  public async getArticlesSuperAdmin(
    @Query('q') search?: string,
    @Query('category') category?: ArticleCategory,
    @Query('is_featured') is_featured?: boolean,
    @Query('is_approved') is_approved?: boolean,
    @Query('author_name') author_name?: string,
    @Query('admin_id') admin_id?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ArticlesApiResponse> {
    const result = await this.articleService.getArticlesSuperAdmin({
      search,
      category,
      is_featured,
      is_approved,
      author_name,
      admin_id,
      page,
      limit,
    });
    return new ArticlesApiResponse(result);
  }

  @Get('my-articles')
  @GetArticlesByAdminEndpoint()
  public async getArticlesByAdmin(
    @Req() req: Request,
    @Query('q') search?: string,
    @Query('category') category?: ArticleCategory,
    @Query('is_featured') is_featured?: boolean,
    @Query('is_approved') is_approved?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ArticlesApiResponse> {
    const result = await this.articleService.getArticlesByAdmin(req.user.id, {
      search,
      category,
      is_featured,
      is_approved,
      page,
      limit,
    });
    return new ArticlesApiResponse(result);
  }

  @Get(':id')
  @GetArticleEndpoint()
  public async getArticle(
    @Param('id') article_id: string,
  ): Promise<ArticleApiResponse> {
    const result = await this.articleService.getArticle(article_id);
    return new ArticleApiResponse(result);
  }

  @Post()
  @CreateArticleEndpoint()
  public async createArticle(
    @Req() req: Request,
    @Body() body: CreateArticleRequestBody,
  ): Promise<ArticleApiResponse> {
    const result = await this.articleService.createArticle(req.user.id, body);
    return new ArticleApiResponse(result);
  }

  @Patch(':id')
  @UpdateArticleEndpoint()
  public async updateArticle(
    @Req() req: Request,
    @Param('id') article_id: string,
    @Body() body: UpdateArticleRequestBody,
  ): Promise<ArticleApiResponse> {
    const result = await this.articleService.updateArticle(
      req.user.id,
      article_id,
      body,
    );
    return new ArticleApiResponse(result);
  }

  @Delete(':id')
  @DeleteArticleEndpoint()
  public async deleteArticle(
    @Req() req: Request,
    @Param('id') article_id: string,
  ): Promise<SuccessResponseBody> {
    await this.articleService.deleteArticle(req?.user?.id!, article_id);
    return new SuccessResponseBody({
      message: RESPONSE_MESSAGES.Article.Success.Deleted,
    });
  }
}
