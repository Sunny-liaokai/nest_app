/**
 * 全局共享模块
 * */
import { Global, Module } from '@nestjs/common';
import { UtilService } from './services/util.service';
import { RedisService } from './services/redis.service';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
const providers = [UtilService, RedisService];

@Global()
@Module({
  imports: [
    // CacheModule.register(),
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        password: configService.get<string>('REDIS_PASSWORD'),
        db: configService.get<number>('REDIS_DB'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // 工厂函数 进行加工
        secret: configService.get<string>('JWT_SECRET'), // jwt全局标识码
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...providers],
  exports: [...providers, JwtModule],
})
export class SharedModule {}
