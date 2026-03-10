import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from '../admin/admin.module';
import { Articles } from '../../db/models/article.model';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from './services/article.service';
import { ArticleRepository } from './repositories/article.repository';

@Module({
  imports: [SequelizeModule.forFeature([Articles]), AdminModule],
  controllers: [ArticleController],
  providers: [
    ArticleRepository,

    { provide: 'IArticleRepository', useExisting: ArticleRepository },
    ArticleService,
    { provide: 'IArticleService', useExisting: ArticleService },
  ],
  exports: [SequelizeModule],
})
export class ArticleModlue {}
