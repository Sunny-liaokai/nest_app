import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';
import { AuthGuard } from '../core/authJwt/auth.guard';
import { AccountModule } from './account/account.module';
/**
 * 统一引入处理module模块
 */
@Module({
  imports: [
    // /*注册路由模块 主要起到重起路由名称*/
    RouterModule.register([
      {
        path: 'admin',
        children: [
          { path: 'sys', module: SystemModule },
          { path: 'account', module: AccountModule },
        ],
      },
      {
        path: 'admin',
        module: LoginModule,
      },
    ]),
    // 组件模块
    LoginModule,
    SystemModule,
    AccountModule,
  ],
  providers: [
    {
      // 全局权限拦截
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [SystemModule],
})
export class AdminModule {}
