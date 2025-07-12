import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_PREFIX } from './constants';

export default function setUpSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Ndu-TV')
    .setVersion(API_PREFIX)
    .setDescription('Documentation for Ndu-TV server')
    .addCookieAuth('access_token')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
