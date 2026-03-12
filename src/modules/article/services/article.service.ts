import { Inject, Injectable } from '@nestjs/common';
import {
  GetArticlesAdminFilter,
  GetArticlesFilter,
  GetArticlesSuperAdminFilter,
  IArticleService,
} from './interfaces/article.interface';
import { CustomLogger } from '../../../lib/logger/logger.service';
import { IAdminRepository } from '../../admin/repositories/interfaces/admin-repository.interface';
import { IArticleRepository } from '../repositories/interfaces/article-repository.interface';
import { ArticleDto } from '../dtos/article.dto';
import {
  CreateArticleRequestBody,
  UpdateArticleRequestBody,
} from '../dtos/article.request.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../../../shared/exceptions';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import { Role } from '../../../shared/enums';
import { search } from '../../../shared/helpers/repository.helper';
import { FiltersOrOperators } from '../../../shared/types/repositories.types';
import { Articles } from '../../../db/models/article.model';

@Injectable()
export class ArticleService implements IArticleService {
  constructor(
    @Inject() private readonly logger: CustomLogger,
    @Inject('IArticleRepository')
    private readonly articleRepository: IArticleRepository,
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {
    this.logger.setContext(ArticleService.name);
  }

  private async resolveAdmin(admin_id: string) {
    const admin = await this.adminRepository.findById(admin_id, {
      relations: ['role'],
    });

    if (!admin)
      throw new BadRequestException({
        reason: RESPONSE_MESSAGES.Admin.Failiure.NotFound,
      });

    return admin;
  }

  private async resolveArticle(article_id: string) {
    const article = await this.articleRepository.findById(article_id);

    if (!article)
      throw new NotFoundException({
        reason: RESPONSE_MESSAGES.Article.Failure.NotFound,
      });

    return article;
  }

  private assertAdminActivated(
    admin: Awaited<ReturnType<typeof this.resolveAdmin>>,
  ) {
    const isSuperAdmin = admin.role.role === Role.SUPER_ADMIN;
    const isActivated =
      admin.is_admin_enabled && admin.must_set_password && admin.password;

    if (!isSuperAdmin && !isActivated)
      throw new ForbiddenException({
        reason: RESPONSE_MESSAGES.Auth.Failure.Forbidden,
      });
  }

  public async getArticle(article_id: string): Promise<ArticleDto> {
    try {
      const article = await this.resolveArticle(article_id);
      return new ArticleDto(article);
    } catch (error) {
      this.logger.logServiceError(this.getArticle.name, error);
      throw error;
    }
  }

  public async createArticle(
    admin_id: string,
    data: CreateArticleRequestBody,
  ): Promise<ArticleDto> {
    try {
      const [admin, existingArticle] = await Promise.all([
        this.resolveAdmin(admin_id),
        this.articleRepository.findBy({ title: data.title }),
      ]);

      this.assertAdminActivated(admin);

      if (existingArticle)
        throw new BadRequestException({
          reason: RESPONSE_MESSAGES.Article.Failure.AlreadyExists,
        });

      const { ...rest } = data;

      const newArticle = await this.articleRepository.create({
        ...rest,
        author_name: admin.name,
        admin_id,
        is_approved: false,
        is_featured: data.is_featured ?? false,
      });

      return new ArticleDto(newArticle);
    } catch (error) {
      this.logger.logServiceError(this.createArticle.name, error);
      throw error;
    }
  }

  public async updateArticle(
    admin_id: string,
    article_id: string,
    data: UpdateArticleRequestBody,
  ): Promise<ArticleDto> {
    try {
      const [admin, article] = await Promise.all([
        this.resolveAdmin(admin_id),
        this.resolveArticle(article_id),
      ]);

      this.assertAdminActivated(admin);

      const isSuperAdmin = admin.role.role === Role.SUPER_ADMIN;

      if (!isSuperAdmin && article.admin_id !== admin_id)
        throw new ForbiddenException({
          reason: RESPONSE_MESSAGES.Auth.Failure.Forbidden,
        });

      if (data.is_approved !== undefined && !isSuperAdmin) {
        throw new ForbiddenException({
          reason: RESPONSE_MESSAGES.Auth.Failure.Forbidden,
        });
      }

      const updated = await this.articleRepository.updateByModel(article, data);
      return new ArticleDto(updated);
    } catch (error) {
      this.logger.logServiceError(this.updateArticle.name, error);
      throw error;
    }
  }

  public async deleteArticle(
    admin_id: string,
    article_id: string,
  ): Promise<void> {
    try {
      const [admin, article] = await Promise.all([
        this.resolveAdmin(admin_id),
        this.resolveArticle(article_id),
      ]);

      this.assertAdminActivated(admin);
      const isSuperAdmin = admin.role.role === Role.SUPER_ADMIN;

      if (!isSuperAdmin && article.admin_id !== admin_id)
        throw new ForbiddenException({
          reason: RESPONSE_MESSAGES.Auth.Failure.Forbidden,
        });

      await this.articleRepository.delete(article);
    } catch (error) {
      this.logger.logServiceError(this.deleteArticle.name, error);
      throw error;
    }
  }

  public async getArticles(filters: GetArticlesFilter): Promise<ArticleDto[]> {
    try {
      const {
        category,
        is_featured,
        search: search_term,
        page,
        limit,
      } = filters;

      const _filters: FiltersOrOperators<Articles> = {
        is_approved: true,
        ...(category && { category }),
        ...(is_featured !== undefined && { is_featured }),
        ...(search_term &&
          search<Articles>(['title', 'summary', 'author_name'], search_term)),
      };

      const articles = await this.articleRepository.findManyBy(_filters, {
        order: [['created_at', 'DESC']],
        page,
        limit,
      });
      return ArticleDto.fromEntities(articles);
    } catch (error) {
      this.logger.logServiceError(this.getArticles.name, error);
      throw error;
    }
  }

  public async getArticlesSuperAdmin(
    filters: GetArticlesSuperAdminFilter,
  ): Promise<ArticleDto[]> {
    try {
      const {
        category,
        is_featured,
        is_approved,
        author_name,
        admin_id,
        search: search_term,
        page,
        limit,
      } = filters;

      const _filters: FiltersOrOperators<Articles> = {
        ...(category && { category }),
        ...(is_featured !== undefined && { is_featured }),
        ...(is_approved !== undefined && { is_approved }),
        ...(author_name && { author_name }),
        ...(admin_id && { admin_id }),
        ...(search_term &&
          search<Articles>(['title', 'summary', 'author_name'], search_term)),
      };

      const articles = await this.articleRepository.findManyBy(_filters, {
        order: [['created_at', 'DESC']],
        page,
        limit,
      });
      return ArticleDto.fromEntities(articles);
    } catch (error) {
      this.logger.logServiceError(this.getArticlesSuperAdmin.name, error);
      throw error;
    }
  }

  public async getArticlesByAdmin(
    admin_id: string,
    filters: GetArticlesAdminFilter,
  ): Promise<ArticleDto[]> {
    try {
      const {
        category,
        is_featured,
        is_approved,
        search: search_term,
        page,
        limit,
      } = filters;

      const _filters: FiltersOrOperators<Articles> = {
        admin_id,
        ...(category && { category }),
        ...(is_featured !== undefined && { is_featured }),
        ...(is_approved !== undefined && { is_approved }),
        ...(search_term &&
          search<Articles>(['title', 'summary', 'author_name'], search_term)),
      };

      const articles = await this.articleRepository.findManyBy(_filters, {
        order: [['created_at', 'DESC']],
        page,
        limit,
      });
      return ArticleDto.fromEntities(articles);
    } catch (error) {
      this.logger.logServiceError(this.getArticlesByAdmin.name, error);
      throw error;
    }
  }
}
