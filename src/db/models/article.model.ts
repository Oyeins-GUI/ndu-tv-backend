import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Table,
  Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';

import { ArticleCategory } from '../../shared/enums/article.enum';
import { Admin } from './admins.model';

@Table({
  tableName: 'articles',
})
export class Articles extends BaseModel {
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(500))
  declare title: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare author_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare summary: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ArticleCategory)))
  declare category: ArticleCategory;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare image_url: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_featured: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_approved: boolean;

  @ForeignKey(() => Admin)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare admin_id: string;

  @BelongsTo(() => Admin, 'admin_id')
  declare Admin: Admin;
}
