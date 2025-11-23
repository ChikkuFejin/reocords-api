import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  // app.useGlobalInterceptors(new CustomCacheInterceptor()); //having issue so that cammnd the cacheing interceptors

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Records API')
    .setDescription('API documentation for Records backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    useGlobalPrefix: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
