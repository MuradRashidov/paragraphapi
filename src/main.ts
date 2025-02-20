import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000', // Sadece Next.js için izin ver
    credentials: true, // Çerezleri (cookies) desteklemek için
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Kullanılabilir HTTP metotları
    allowedHeaders: ['Content-Type', 'Authorization'], // Kullanılabilir header'lar
  });
  await app.listen(8000);
}
bootstrap();
