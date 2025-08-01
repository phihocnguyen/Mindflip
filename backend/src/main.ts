import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/interceptors';
import { HttpExceptionFilter } from './core/filters';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS và các middleware khác nếu cần
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api'); // Thêm tiền tố /api cho tất cả các route
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Áp dụng interceptor transform toàn cục
  app.useGlobalInterceptors(new TransformInterceptor());

  // Áp dụng filter exception toàn cục
  app.useGlobalFilters(new HttpExceptionFilter());

  // --- Bắt đầu cấu hình Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Mindflip API')
    .setDescription('Tài liệu API cho ứng dụng học từ vựng')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // UI sẽ có tại /docs
  // --- Kết thúc cấu hình Swagger ---

  await app.listen(3333);
}
bootstrap();