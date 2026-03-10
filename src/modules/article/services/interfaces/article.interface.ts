import { ArticleCategory } from '../../../../shared/enums/article.enum';
import { PaginationInput } from '../../../../shared/types/repositories.types';
import { ArticleDto } from '../../dtos/article.dto';
import {
  CreateArticleRequestBody,
  UpdateArticleRequestBody,
} from '../../dtos/article.request.dto';

export type GetArticlesFilter = PaginationInput & {
  category?: ArticleCategory;
  is_featured?: boolean;
  search?: string;
};

export type GetArticlesAdminFilter = PaginationInput & {
  category?: ArticleCategory;
  is_featured?: boolean;
  is_approved?: boolean;
  search?: string;
};

export type GetArticlesSuperAdminFilter = PaginationInput & {
  category?: ArticleCategory;
  is_featured?: boolean;
  is_approved?: boolean;
  author_name?: string;
  admin_id?: string;
  search?: string;
};

export interface IArticleService {
  getArticle(article_id: string): Promise<ArticleDto>;

  createArticle(
    admin_id: string,
    data: CreateArticleRequestBody,
  ): Promise<ArticleDto>;

  updateArticle(
    admin_id: string,
    article_id: string,
    data: UpdateArticleRequestBody,
  ): Promise<ArticleDto>;

  deleteArticle(admin_id: string, article_id: string): Promise<void>;

  getArticles(filters: GetArticlesFilter): Promise<ArticleDto[]>;

  getArticlesSuperAdmin(
    filters: GetArticlesSuperAdminFilter,
  ): Promise<ArticleDto[]>;

  getArticlesByAdmin(
    admin_id: string,
    filters: GetArticlesAdminFilter,
  ): Promise<ArticleDto[]>;
}
