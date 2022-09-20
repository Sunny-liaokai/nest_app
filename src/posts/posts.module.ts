import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])], // 处理实体相关
  controllers: [PostsController], //处理路由相关
  providers: [PostsService], // 处理业务相关
})
export class PostsModule {}
