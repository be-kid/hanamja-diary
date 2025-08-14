import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 자격 증명(쿠키, HTTP 인증 헤더 등) 허용
  });
  app.useGlobalPipes(new ValidationPipe()); // 전역 유효성 검사 파이프 추가
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
