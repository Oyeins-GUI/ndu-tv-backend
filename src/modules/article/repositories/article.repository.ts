import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Articles } from '../../../db/models/article.model';
import {
  ArticleRelations,
  CreateArticleInput,
  IArticleRepository,
  UpdateArticleInput,
} from './interfaces/article-repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { IncludeOptions } from 'sequelize';
import { Admin } from '../../../db/models/admins.model';

@Injectable()
export class ArticleRepository
  extends BaseRepository<
    Articles,
    CreateArticleInput,
    UpdateArticleInput,
    ArticleRelations
  >
  implements IArticleRepository
{
  constructor(
    @InjectModel(Articles) private readonly articleModel: typeof Articles,
  ) {
    super(articleModel);
  }

  protected computeRelations(relations: ArticleRelations[]): IncludeOptions[] {
    const allRelations: ArticleRelations[] = ['admin'];

    const toInclude = relations.includes('all') ? allRelations : relations;

    const include: IncludeOptions[] = [];

    if (toInclude.includes('admin')) {
      include.push({
        model: Admin,
        as: 'admin',
        attributes: ['id', 'name', 'email'],
      });
    }

    return include;
  }
}
