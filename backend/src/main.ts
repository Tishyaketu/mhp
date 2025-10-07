// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();