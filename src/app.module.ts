import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; //使用typeorm链接数据库
import { parseEnv } from '../config/env';

import { AdminModule } from './modules/admin.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // 全局查找配置文件
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [parseEnv().path], //文件默认配置
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        // entities: [PostsEntity], // 数据表实体
        autoLoadEntities: true, // 自动加入实体
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'), // 用户名
        password: configService.get<string>('DB_PASSWD'), // 密码
        database: configService.get<string>('DB_DATABASE'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    AdminModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
