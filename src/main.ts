import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: [
      'https://127.0.0.1:3000/',
      'https://localhost:3000/',
      'https://127.0.0.1:3000/',
      'https://localhost:3000/',
      'http://127.0.0.1:3000/',
      'http://localhost:3000/',
      'http://127.0.0.1:3000/',
      'http://localhost:3000/',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
