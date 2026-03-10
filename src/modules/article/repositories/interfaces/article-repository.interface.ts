import { Articles } from '../../../../db/models/article.model';
import { ArticleCategory } from '../../../../shared/enums/article.enum';
import { IBaseRepository } from '../../../../shared/interfaces/base-repository.interface';
import { AtLeastOne } from '../../../../shared/types/repositories.types';

export interface IArticleRepository
  extends IBaseRepository<
    Articles,
    CreateArticleInput,
    UpdateArticleInput,
    ArticleRelations
  > {}

export type CreateArticleInput = {
  author_name: string;
  admin_id: string;
  content: string;
  summary: string;
  title: string;
  category: ArticleCategory;
  is_featured: boolean;
  is_approved: boolean;
  image_url: string;
};

export type UpdateArticleInput = Omit<
  AtLeastOne<CreateArticleInput>,
  'admin_id' | 'author_name'
>;

export type ArticleRelations = 'all' | 'admin';
