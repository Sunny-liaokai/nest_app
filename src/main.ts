import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { flatten } from 'lodash';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
    {
      bufferLogs: true, //将日志放入缓存中 直至应用初始化成功
    },
  );
  // app.use(express.json()); // For parsing application/json
  // app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  // app.setGlobalPrefix('api'); // 设置全局路由前缀
  app.enableCors();
  // 注册管道 验证接口字段
  app.useGlobalPipes(new ValidationPipe());
  //  拦截错误信息进行统一处理
  app.useGlobalFilters(new HttpExceptionFilter());
  // 拦截成功后统一处理错误返回
  app.useGlobalInterceptors(new TransformInterceptor());
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('小小感慨测试文档')
    .setDescription('接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}

bootstrap().then();
