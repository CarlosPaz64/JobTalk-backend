import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Elimina campos no declarados en los DTOs
      forbidNonWhitelisted: true,
      transform: true,       // Transforma automáticamente los tipos
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({ origin: '*' });

  await app.listen(3000);
  console.log('JobTalk backend corriendo en http://localhost:3000/api/v1');
}

bootstrap();