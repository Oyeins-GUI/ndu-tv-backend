import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX } from './constants';
import env from './env.config';

export default function setUpSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(env.APP_NAME)
    .setVersion(API_PREFIX)
    .setDescription(`Documentation for ${env.APP_NAME} server`)
    .addCookieAuth('access_token')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
