import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
