import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { env } from '../config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      database: env.DB_NAME,
      password: env.DB_PASSWORD,
      autoLoadModels: true,
      synchronize: true,
      define: {
        underscored: true,
        paranoid: true,
        timestamps: true,
      },
      retry: {
        max: 1,
      },
    }),
  ],
})
export class DatabaseModule {}
