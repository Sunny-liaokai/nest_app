import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [SystemModule], // 处理实体相关
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService], // 暴露给其他模块使用，确保存在于上下文中
})
export class LoginModule {}
