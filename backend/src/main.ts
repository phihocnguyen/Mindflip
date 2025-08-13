import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './core/interceptors';
import { HttpExceptionFilter } from './core/filters';
import { INestApplication, ValidationPipe } from '@nestjs/common';
let cachedApp: INestApplication;
async function bootstrap(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Mindflip API')
    .setDescription('Tài liệu API cho ứng dụng học từ vựng')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.init();

  cachedApp = app;
  return app;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
};