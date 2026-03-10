import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ErrorType, StandardDocs } from '../../../shared/helpers/doc.helper';
import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
import {
  ArticleApiResponse,
  ArticlesApiResponse,
  PaginatedArticlesApiResponse,
} from '../dtos/article.response.dto';
import { SuccessResponseBody } from '../../../shared/responses/success-response';
import { Public } from '../../../shared/decorators/public.decorator';
import { ArticleCategory } from '../../../shared/enums/article.enum';

export function GetArticleEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get a single article by ID',
      includeErrors: [ErrorType.NOT_FOUND, ErrorType.INTERNAL_SERVER_ERROR],
      successMessage: RESPONSE_MESSAGES.Article.Success.Retrieved,
      status: HttpStatus.OK,
      type: ArticleApiResponse,
    }),
  );
}

export function GetArticlesEndpoint() {
  return applyDecorators(
    Public(),
    StandardDocs({
      summary: 'Get all approved articles (public)',
      includeErrors: [ErrorType.INTERNAL_SERVER_ERROR],
      successMessage: RESPONSE_MESSAGES.Article.Success.Retrieved,
      status: HttpStatus.OK,
      type: PaginatedArticlesApiResponse,
      queryParams: [
        {
          name: 'q',
          type: 'string',
          description: 'Search term',
          required: false,
        },
        {
          name: 'category',
          type: 'string',
          enum: [ArticleCategory],
          description: 'Filter by category',
          required: false,
        },
        {
          name: 'is_featured',
          type: 'boolean',
          description: 'Filter by featured status',
          required: false,
        },
        {
          name: 'page',
          type: 'number',
          description: 'Page number',
          required: false,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Items per page',
          required: false,
        },
      ],
    }),
  );
}

export function GetArticlesSuperAdminEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: 'Get all articles (super admin)',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Article.Success.Retrieved,
      status: HttpStatus.OK,
      type: PaginatedArticlesApiResponse,
      queryParams: [
        {
          name: 'q',
          type: 'string',
          description: 'Search term',
          required: false,
        },
        {
          name: 'category',
          type: 'string',
          enum: [ArticleCategory],
          description: 'Filter by category',
          required: false,
        },
        {
          name: 'is_featured',
          type: 'boolean',
          description: 'Filter by featured status',
          required: false,
        },
        {
          name: 'is_approved',
          type: 'boolean',
          description: 'Filter by approval status',
          required: false,
        },
        {
          name: 'author_name',
          type: 'string',
          description: 'Filter by author name',
          required: false,
        },
        {
          name: 'admin_id',
          type: 'string',
          description: 'Filter by admin UUID',
          required: false,
        },
        {
          name: 'page',
          type: 'number',
          description: 'Page number',
          required: false,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Items per page',
          required: false,
        },
      ],
    }),
  );
}

export function GetArticlesByAdminEndpoint() {
  return applyDecorators(
    StandardDocs({
      summary: "Get current admin's own articles",
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Article.Success.Retrieved,
      status: HttpStatus.OK,
      type: PaginatedArticlesApiResponse,
      queryParams: [
        {
          name: 'q',
          type: 'string',
          description: 'Search term',
          required: false,
        },
        {
          name: 'category',
          type: 'string',
          enum: [ArticleCategory],
          description: 'Filter by category',
          required: false,
        },
        {
          name: 'is_featured',
          type: 'boolean',
          description: 'Filter by featured status',
          required: false,
        },
        {
          name: 'is_approved',
          type: 'boolean',
          description: 'Filter by approval status',
          required: false,
        },
        {
          name: 'page',
          type: 'number',
          description: 'Page number',
          required: false,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Items per page',
          required: false,
        },
      ],
    }),
  );
}

export function CreateArticleEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.CREATED),
    StandardDocs({
      summary: 'Create an article',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Article.Success.Created,
      status: HttpStatus.CREATED,
      type: ArticleApiResponse,
    }),
  );
}

export function UpdateArticleEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    StandardDocs({
      summary: 'Update an article',
      includeErrors: [
        ErrorType.BAD_REQUEST,
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Article.Success.Updated,
      status: HttpStatus.OK,
      type: ArticleApiResponse,
    }),
  );
}

export function DeleteArticleEndpoint() {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    StandardDocs({
      summary: 'Delete an article',
      includeErrors: [
        ErrorType.UNAUTHORIZED,
        ErrorType.FORBIDDEN,
        ErrorType.NOT_FOUND,
        ErrorType.INTERNAL_SERVER_ERROR,
      ],
      successMessage: RESPONSE_MESSAGES.Article.Success.Deleted,
      status: HttpStatus.NO_CONTENT,
      type: SuccessResponseBody,
    }),
  );
}
