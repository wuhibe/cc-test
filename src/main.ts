import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Coaching Central API')
    .setDescription('API docs for Coaching Central')
    .setVersion('0.0.1')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_ctrlKey: string, methodKey: string) => methodKey,
  };
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Coaching Central API Docs',
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
