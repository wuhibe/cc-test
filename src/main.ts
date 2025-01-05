import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

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

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
