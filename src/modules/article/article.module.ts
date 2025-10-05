import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [SequelizeModule.forFeature([]), AdminModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ArticleModlue {}
